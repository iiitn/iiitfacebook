import * as SocketIO from 'socket.io';
import { IRequest, IResponse, IRequestAction, IResponseData } from '../Schema/Common';
import { Promise } from 'es6-promise';
import { Database } from './Database';
import { UserSchema } from '../Schema/User';
import _ = require('lodash');
import { IO } from './index';
import { Connection } from './Connection';
import { v4 } from 'uuid';
import { WallSchema, IWallSchema } from '../Schema/Wall';

interface IUser {
	[userid: string]: {
		sockets: SocketIO.Socket[]
	}|undefined
}

export class User extends Connection {
	private static users: IUser = {};
	private userid?: string;

	constructor(socket: SocketIO.Socket) {
		super(socket);
	}

	setUserID(userid: string) {
		this.rmSocket();
		this.userid = userid;
		let user = User.users[userid];
		if (user) {
			user.sockets.push(this._socket);
			return;
		}
		User.users[userid] = {
			sockets: [this._socket]
		};
	}
	rmSocket() {
		if (!this.userid) {
			return;
		}
		let user = User.users[this.userid];
		if (user) {
			user.sockets = user.sockets.filter(s=>s!=this._socket);
			if (user.sockets.length==0) {
				delete User.users[this.userid];
			}
			return;
		}
		// DO NOTHING.
	}
	passiveAction(data: IResponseData, users = Object.keys(User.users)) {
		users.forEach(u=>{
			let user = User.users[u];
			if (user) {
				user.sockets.forEach(s=>s.emit("PASSIVE_ACTION", data));
			}
		});
	}

	processRequest(data: IRequestAction): Promise<IResponseData> {
		switch(data.type) {
			case "USER_LOGIN": {
				return Database.collection("user").find(data._id).then((udata: any)=>{
					if (udata.password==data.password) {
						this.setUserID(data._id);
						this.broadCastOnlineList();
						return Promise.resolve({
							type: "USER_LOGIN",
							userid: data._id
						} as IResponseData);
					}
					return Promise.reject("Login Failed.");
				});
			}
			case "USER_REGISTER": {
				return Database.collection("user").insert(data, UserSchema)
				.then(()=>{
					return Promise.resolve("USer Successfully registered.");
				});
			}
			case "USER_LOGOUT": {
				this.rmSocket();
				this.broadCastOnlineList();
				return Promise.resolve({
					type: "USER_LOGOUT"
				} as IResponseData);
			}
		}

		if(!this.userid) {
			return Promise.reject("User not logged in yet to perform the action");
		}
		switch(data.type) {
			case "WALL_ADD" : {
				let wallid = v4();
				return Database.collection("wall").insert({
					_id: wallid,
					postedOn: new Date().toString(),
					comments: [],
					postedBy: this.userid,
					content: data.content,
					likes: []
				} as IWallSchema, WallSchema).then(()=>{
					let action: IResponseData = {
						type: "WALL_ADD",
						id: wallid,
						postedOn: new Date().toString(),
						postedBy: this.userid as string,
						content: data.content
					};
					this.passiveAction(action);
					this.passiveAction({
						type: "ADD_POST",
						post_id: wallid
					});
					return Promise.resolve(action);
				}).catch((msg)=>{
					return Promise.reject(msg)
				});
			}
			case "SEND_MESSAGE": {
				this.passiveAction({
					type: "PASSIVE_MESSAGE",
					from: this.userid as string
				}, [data.userid]);
				return Promise.resolve("Done");
			}
		}
		return Promise.reject("Specified action not found.");	
	}
	broadCastOnlineList() {
		// Broadcast.
		Database.collection("user").findAll({}, {_id: true}).then((data)=>{
			let users = _.map(data, "_id");
			this.passiveAction({
				type: "ONLINE_UPDATE",
				users: users,
				online: Object.keys(User.users)
			});
		});
	}
	disconnect() {
		this.rmSocket();
	}
}
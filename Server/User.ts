import * as SocketIO from 'socket.io';
import { IRequest, IResponse, IRequestAction, IResponseData } from '../Schema/Common';
import { Promise } from 'es6-promise';
import { Database } from './Database';
import { UserSchema, IUserSchema } from '../Schema/User';
import _ = require('lodash');
import { IO } from './index';
import { Connection } from './Connection';
import { v4 } from 'uuid';
import { WallSchema, IWallSchema } from '../Schema/Wall';

interface IUser_ctg {
	[batch: string]: {
		[branch: string]: {
			[cls: string]: string[]
		}
	}
}
interface IUser {
	[userid: string]: {
		sockets: SocketIO.Socket[]
	}|undefined
}

export class User extends Connection {
	private static user_ctg: IUser_ctg = {};
	private static users: IUser = {};
	private userid?: string;
	private branch?: IUserSchema["branch"];
	private batch?: IUserSchema["batch"];
	private cls?: IUserSchema["class"];

	constructor(socket: SocketIO.Socket) {
		super(socket);
	}

	setUserID(userid: string, batch: IUserSchema["batch"], branch: IUserSchema["branch"], cls: IUserSchema["class"]) {
		
		this.rmSocket();
		this.userid = userid;
		this.batch = batch;
		this.cls = cls;
		this.branch = branch;

		let path = `${batch}.${branch}.c${cls}`;
		let categ = _.get(User.user_ctg, path) as any;
		if (categ) {
			categ = [...categ, this.userid];
		}else {
			categ = [this.userid];
		}
		_.set(User.user_ctg, path, categ);

		let userSockets = User.users[this.userid];
		if (userSockets) {
			userSockets.sockets.push(this._socket);
		}
		User.users[this.userid] = {
			sockets: [this._socket]
		};
	}
	rmSocket() {
		if (!this.userid) {
			return;
		}
		let userid = this.userid;
		this.userid = undefined;

		let path = `${this.batch}.${this.branch}.c${this.cls}`;
		let categ = _.get(User.user_ctg, path) as any;
		if (categ) {
			categ = categ.filter((u: any)=>u!=userid);
		}
		_.set(User.user_ctg, path, categ);

		let user = User.users[userid];
		if (user) {
			user.sockets = user.sockets.filter(s=>s!=this._socket);
			if (user.sockets.length==0) {
				delete User.users[userid];
			}
			return;
		}
		// DO NOTHING.
	}
	passiveAction(data: IResponseData, users?: string[]) {
		console.log("PASSIVE ACTION : ", users, data);
		if (!users) {
			users =_.get(User.user_ctg, `${this.batch}.${this.branch}.c${this.cls}`) as any;
			if (!users) {
				users = [];
			}
		}
		users.forEach((u: any)=>{
			let userSockets = User.users[u];
			if (userSockets)
				userSockets.sockets.forEach((s: any)=>s.emit("PASSIVE_ACTION", data));
		});
	}

	processRequest(data: IRequestAction): Promise<IResponseData> {
		if (typeof data!="object") {
			return Promise.reject("Malformed reuest found.");
		}
		switch(data.type) {
			case "USER_LOGIN": {
				return Database.collection("user").find(data._id).then((udata: IUserSchema)=>{
					if (udata.password==data.password) {
						this.setUserID(data._id,  udata.batch, udata.branch, udata.class);
						this.broadCastOnlineList();
						return Promise.resolve({
							type: "USER_LOGIN",
							userid: data._id
						} as IResponseData);
					}
					return Promise.reject("Login Failed.");
				}).catch(()=>Promise.reject("LOgin Failed"));
			}
			case "USER_REGISTER": {
				return Database.collection("user").insert(data, UserSchema)
				.then(()=>{
					return Database.collection("user_ctg")
						.addItem({_id: "iiit"}, `${data.batch}.${data.branch}.${data.class}`, data._id)
						.then(()=>Promise.resolve("User Successfully registered."))
						.catch(()=>Promise.reject("Unknown error in database."));
				}).catch(()=>Promise.reject("Registration failed."));
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
			return Promise.reject("User isn't logged in.");
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
			let online = _.get(User.user_ctg, `${this.batch}.${this.branch}.c${this.cls}`) as any;
			console.log(User.user_ctg);
			this.passiveAction({
				type: "ONLINE_UPDATE",
				users: users,
				online
			});
		});
	}
	disconnect() {
		this.rmSocket();
	}
}
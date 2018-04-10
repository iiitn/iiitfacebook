import * as SocketIO from 'socket.io';
import { IRequest, IResponse, IRequestAction, IResponseData } from '../Schema/Common';
import { Database } from './Database';
import { UserSchema, IUserSchema, IUserCategSchema } from '../Schema/User';
import _ = require('lodash');
import { IO } from './index';
import { Connection } from './Connection';
import { v4 } from 'uuid';
import { WallSchema, IWallSchema } from '../Schema/Wall';
import { Schema } from 'classui/Components/Form/Schema';
import * as moment from 'moment';
import { FileUpload } from './FileUpload';

interface IOnline_user_ctg {
	[batch: string]: {
		[branch: string]: {
			[cls: string]: string[]
		}
	}
}
interface IOnlineUser {
	[userid: string]: {
		sockets: SocketIO.Socket[]
	}|undefined
}
interface IUser {
	name: IUserSchema["name"]
	gender: IUserSchema["gender"]
}
interface IUsers {
	[id: string]: IUser|undefined
}

export class User extends Connection {
	private static users: IUsers = {};
	private static user_ctg: IUserCategSchema = {};

	private static users_online: IOnlineUser = {};
	private static user_online_ctg: IOnline_user_ctg = {};

	private loginDetails: {
		userid: string
		branch: IUserSchema["branch"]
		batch: IUserSchema["batch"]
		cls: IUserSchema["class"]
	}|undefined = undefined;

	constructor(socket: SocketIO.Socket) {
		super(socket);
	}

	public static init() {
		Database.on().then(()=>{
			Database.collection("user").findAll({}, {
				_id: true,
				name: true,
				gender: true
			}).then((data: IUser[])=>{
				data.forEach(u=>{
					this.users[(u as any)._id] = {
						gender: u.gender,
						name: u.name
					}
				})
				console.log(this.users);
			});
		}).then(()=>{
			Database.collection("user_ctg").find("iiit").then((data)=>{
				this.user_ctg = data.byBatch;
			});
		});
	}
	getNameByID(id: string) {
		let user = User.users[id];
		return user?user.name:id;
	}

	setUserID(userid: string, batch: IUserSchema["batch"], branch: IUserSchema["branch"], cls: IUserSchema["class"]) {
		
		this.rmSocket();
		this.loginDetails = {
			userid,
			branch,
			batch,
			cls
		};

		let path = `${batch}.${branch}.c${cls}`;
		let categ = _.get(User.user_online_ctg, path) as any;
		if (categ) {
			categ = [...categ, this.loginDetails.userid];
		}else {
			categ = [this.loginDetails.userid];
		}
		_.set(User.user_online_ctg, path, categ);

		let userSockets = User.users_online[this.loginDetails.userid];
		if (userSockets) {
			userSockets.sockets.push(this._socket);
		}
		User.users_online[this.loginDetails.userid] = {
			sockets: [this._socket]
		};
	}
	rmSocket() {
		if (!this.loginDetails) {
			return;
		}
		let userid = this.loginDetails.userid;

		let path = `${this.loginDetails.batch}.${this.loginDetails.branch}.c${this.loginDetails.cls}`;
		this.loginDetails = undefined;
		let categ = _.get(User.user_online_ctg, path) as any;
		if (categ) {
			categ = categ.filter((u: any)=>u!=userid);
		}
		_.set(User.user_online_ctg, path, categ);

		let user = User.users_online[userid];
		if (user) {
			user.sockets = user.sockets.filter(s=>s!=this._socket);
			if (user.sockets.length==0) {
				delete User.users_online[userid];
			}
			return;
		}
		// DO NOTHING.
	}
	passiveAction(data: IResponseData, users?: string[]) {
		if (!this.loginDetails) {
			return;
		}
		if (!users) {
			users =_.get(User.user_online_ctg, `${this.loginDetails.batch}.${this.loginDetails.branch}.c${this.loginDetails.cls}`) as any;
			if (!users) {
				users = [];
			}
		}
		users.forEach((u: any)=>{
			let userSockets = User.users_online[u];
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
						.addItem({_id: "iiit"}, `byBatch.${data.batch}.${data.branch}.${data.class}`, data._id)
						.then(()=>Promise.resolve("User Successfully registered."))
						.catch(()=>Promise.reject("Unknown error in database while registering."));
				});
			}
			case "USER_LOGOUT": {
				this.rmSocket();
				this.broadCastOnlineList();
				return Promise.resolve({
					type: "USER_LOGOUT"
				} as IResponseData);
			}
			case "FILE_UPLOAD": {
				return FileUpload.handleFileUpload(data).then((data)=>{
					if (data.done) {
						// Do something if necessary.
					}
					return data;
				});
			}
		}

		if(!this.loginDetails) {
			return Promise.reject("User isn't logged in.");
		}
		switch(data.type) {
			case "WALL_ADD" : {
				let wallid = v4();
				let user = User.users[this.loginDetails.userid];
				return Database.collection("wall").insert({
					_id: wallid,
					postedOn: new Date().getTime(),
					comments: [],
					postedBy: this.loginDetails.userid,
					content: data.content,
					likes: []
				} as IWallSchema, WallSchema).then(()=>{
					let action: IResponseData = {
						type: "WALL_ADD",
						id: wallid,
						postedOn: moment(new Date().getTime()).calendar(),
						postedBy: user?user.name:(this.loginDetails?this.loginDetails.userid:"" as string),
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
					from: this.getNameByID(this.loginDetails.userid)
				}, [data.userid]);
				return Promise.resolve("Done");
			}
		}
		return Promise.reject("Specified action not found.");	
	}
	broadCastOnlineList() {
		// Broadcast.

		Database.collection("user").findAll({}, {_id: true}).then((data)=>{
			if (!this.loginDetails) {
				return;
			}
			let users = _.map(data, "_id");
			let online = _.get(User.user_online_ctg, `${this.loginDetails.batch}.${this.loginDetails.branch}.c${this.loginDetails.cls}`) as any as string[];
			this.passiveAction({
				type: "ONLINE_UPDATE",
				online: online.map(o=>({
					name: this.getNameByID(o),
					id: o
				}))
			});
		});
	}
	disconnect() {
		this.rmSocket();
	}
}
User.init();
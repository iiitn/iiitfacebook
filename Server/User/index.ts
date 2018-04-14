import * as SocketIO from 'socket.io';
import { IRequest, IResponse, IRequestAction, IResponseData } from 'Schema/Common';
import { Database } from 'Server/Database';
import { UserSchema, IUserSchema, IUserCategSchema } from 'Schema/User';
import _ = require('lodash');
import { Connection } from './Connection';
import { v4 } from 'uuid';
import { WallSchema, IWallSchema } from 'Schema/Wall';
import { Schema } from 'classui/Components/Form/Schema';
import * as moment from 'moment';
import { FileUpload } from 'Server/FileUpload';
import { UserInfo } from 'Server/User/UserInfo';
import { Broadcast } from 'Server/User/Broadcast';
import { userInfo } from 'os';

interface IUser {
	name: IUserSchema["name"]
	gender: IUserSchema["gender"]
}
interface IUsers {
	[id: string]: IUser|undefined
}

export class User extends Connection {
	private userid?: string;
	private broadcast?: Broadcast;

	constructor(socket: SocketIO.Socket) {
		super(socket);
	}

	setUserID(userid: string) {
		
		this.rmSocket();
		this.userid = userid;
		this.broadcast = new Broadcast(userid);
		UserInfo.addSocket(this.userid, this._socket);
	}
	rmSocket() {
		if (!this.userid) {
			return;
		}
		UserInfo.rmSocket(this.userid, this._socket);
		this.userid = undefined;
		this.broadcast = undefined;
	}

	processRequest(data: IRequestAction): Promise<IResponseData> {
		if (typeof data!="object") {
			return Promise.reject("Malformed reuest found.");
		}
		switch(data.type) {
			case "USER_LOGIN": {
				return Database.collection("user").find(data._id).then((udata: IUserSchema)=>{
					if (udata.password==data.password) {
						this.setUserID(data._id);
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
						.addItem({_id: "iiit"}, `byBatch.${data.batch}.${data.branch}.${data.cls}`, data._id)
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

		if(!this.userid) {
			return Promise.reject("User isn't logged in.");
		}
		switch(data.type) {
			case "WALL_ADD" : {
				let wallid = v4();
				let user = UserInfo.getUserDetails(this.userid);
				return Database.collection("wall").insert({
					_id: wallid,
					postedOn: new Date().getTime(),
					comments: [],
					postedBy: this.userid,
					content: data.content,
					likes: []
				} as IWallSchema, WallSchema).then(()=>{
					let action: IResponseData = {
						type: "WALL_ADD",
						id: wallid,
						postedOn: moment(new Date().getTime()).calendar(),
						postedBy: user?user.name:(this.userid?this.userid:"" as string),
						content: data.content
					};
					this.broadcast && this.broadcast.toClass(action) &&
					this.broadcast.toSelf({
						type: "ADD_POST",
						post_id: wallid
					});
					return Promise.resolve(action);
				}).catch((msg)=>{
					return Promise.reject(msg)
				});
			}
			case "SEND_MESSAGE": {
				this.broadcast && this.broadcast.passiveAction({
					type: "PASSIVE_MESSAGE",
					from: UserInfo.getNameByID(this.userid)
				}, [data.userid]);
				return Promise.resolve("Done");
			}
		}
		return Promise.reject("Specified action not found.");	
	}
	broadCastOnlineList() {
		// Broadcast.

		Database.collection("user").findAll({}, {_id: true}).then((data)=>{
			if (!this.userid) {
				return;
			}
			let users = _.map(data, "_id");
			let online = UserInfo.getOnlineClassCollegues(this.userid);
			this.broadcast && this.broadcast.toClass({
				type: "ONLINE_UPDATE",
				online: online.map(o=>({
					name: UserInfo.getNameByID(o),
					id: o
				}))
			});
		});
	}
	disconnect() {
		this.rmSocket();
	}
}
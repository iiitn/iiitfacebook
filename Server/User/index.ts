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
import { UserActions } from 'Server/User/Actions';

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
	private dbAction: UserActions = new UserActions("");

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
				return UserActions.login(data).then(udata=>{
					this.setUserID(data._id);
					this.broadCastOnlineList();
					this.dbAction = new UserActions(udata._id);
					return Promise.resolve({
						type: "USER_LOGIN",
						userid: data._id,
						collegueDetails: UserInfo.getCollegueDetails(data._id)
					} as IResponseData);
				});
			}
			case "USER_REGISTER": {
				return UserActions.register(data);
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
				return this.dbAction.wall_add(data.content).then((wdata)=>{
					let action: IResponseData = {
						type: "WALL_ADD",
						id: wdata._id,
						postedOn: moment(new Date().getTime()).calendar(),
						postedBy: UserInfo.getNameByID(this.userid as string),
						content: data.content
					};
					this.broadcast && (this.broadcast.toClass(action),
					this.broadcast.toSelf({
						type: "USER_WALL_ADD_ID",
						post_id: wdata._id
					}));
					return Promise.resolve(action);
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
		if (!this.userid)
			return;
		let online = UserInfo.getOnlineCollegues(this.userid);
		this.broadcast && this.broadcast.toClass({
			type: "ONLINE_UPDATE",
			online: online.map(o=>({
				name: UserInfo.getNameByID(o),
				id: o
			}))
		});
	}
	disconnect() {
		this.rmSocket();
	}
}
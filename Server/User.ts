import * as SocketIO from 'socket.io';
import { IRequest, IResponse, IRequestData } from '../Schema/Common';
import { Promise } from 'es6-promise';
import { Database } from './Database';
import { UserSchema } from '../Schema/User';
import _ = require('lodash');
import { IO } from './index';

export class User {
	private static onlineList: string[] = [];
	private userid?: string;
	private _socket: SocketIO.Socket;
	private _requests: IRequest[] = [];

	constructor(socket: SocketIO.Socket) {
		this._socket = socket;

		this._socket.addListener("request", (request: IRequest)=>{
			this._requests.push(request);
			this._process();
		});
		this._socket.on("disconnect", this.disConnect.bind(this));
	}
	processRequest(data: IRequestData): Promise<any> {
		console.log("Request : ", data);
		switch(data.type) {
			case "USER_LOGIN": {
				return Database.collection("user").find(data._id).then((udata: any)=>{
					console.log("Data FROM DATABASE : ", udata);
					if (udata.password==data.password) {
						User.onlineList.push(data._id);
						this.userid = data._id;
						Database.collection("user").findAll({}, {_id: true}).then((data)=>{
							let users = _.map(data, "_id");
							IO.emit("PASSIVE_ACTION", {
								type: "ONLINE_UPDATE",
								users: users,
								online: User.onlineList
							})
						})
						return Promise.resolve({
							type: "USER_LOGIN",
							userid: data._id
						});
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
				User.onlineList = User.onlineList.filter(id=>id!=this.userid);
				this.userid = undefined;
				Database.collection("user").findAll({}, {_id: true}).then((data)=>{
					let users = _.map(data, "_id");
					IO.emit("PASSIVE_ACTION", {
						type: "ONLINE_UPDATE",
						users: users,
						online: User.onlineList
					});
				})		
				return Promise.resolve({
					type: "USER_LOGOUT"
				})
			}
		}
		return Promise.reject("Specified action not found.");	
	}
	disConnect() {
		User.onlineList = User.onlineList.filter(id=>id!=this.userid);
		this._socket.removeAllListeners("request");
		Database.collection("user").findAll({}, {_id: true}).then((data)=>{
			let users = _.map(data, "_id");
			IO.emit("PASSIVE_ACTION", {
				type: "ONLINE_UPDATE",
				users: users,
				online: User.onlineList
			});
		})
	}


	private _processing = false;
	_process() {
		if (this._processing) {
			return;
		}
		// Get request from queue.
		let request = this._requests.shift();
		if (!request) {
			// No requests found.
			return;
		}

		// Request found. Start processing.
		this._processing = true;
		let req_id = request.req_id;
		this.processRequest(request.data).then((data)=>{
			this._socket.emit("response", {
				res_id: req_id,
				data
			} as IResponse);
		}).catch((err)=>{
			this._socket.emit("response", {
				res_id: req_id,
				error: err
			} as IResponse);
		}).finally(()=>{
			this._processing = false;
			this._process();
		})
	}
}
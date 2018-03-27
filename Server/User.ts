import * as SocketIO from 'socket.io';
import { IRequest, IResponse, IRequestData } from '../Schema/Common';
import { Promise } from 'es6-promise';
import { Database } from './Database';
import { UserSchema } from '../Schema/User';

export class User {
	private _socket: SocketIO.Socket;
	private _requests: IRequest[] = [];
	constructor(socket: SocketIO.Socket) {
		this._socket = socket;

		this._socket.addListener("request", (request: IRequest)=>{
			this._requests.push(request);
			this._process();
		});
	}
	processRequest(data: IRequestData): Promise<any> {
		console.log("Request : ", data);
		switch(data.type) {
			case "USER_LOGIN": {
				return Database.collection("user").find(data.userid).then((udata: any)=>{
					console.log("Data FROM DATABASE : ", udata);
					if (udata.password==data.password) {
						return Promise.resolve("Successfully logged in.");
					}
					return Promise.reject("Login Failed.");
				});
			}
			case "USER_REGISTER": {
				return Promise.resolve("Registered.");
			}
		}
		return Promise.reject("Specified action not found.");	
	}
	disConnect() {
		this._socket.removeAllListeners("request");
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
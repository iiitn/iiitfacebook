import * as SocketIO from 'socket.io';
import { IRequest, IResponse, IRequestAction, IResponseData } from '../Schema/Common';
import { Promise } from 'es6-promise';
import { Database } from './Database';
import { UserSchema } from '../Schema/User';
import _ = require('lodash');
import { IO } from './index';


export abstract class Connection {
	protected _socket: SocketIO.Socket;
	protected static _sockets: SocketIO.Socket[] = [];
	private _requests: IRequest[] = [];

	constructor(socket: SocketIO.Socket) {
		this._socket = socket;
		Connection._sockets.push(socket);

		this._disconnect = this._disconnect.bind(this);
		this._socket.addListener("request", (request: IRequest)=>{
			this._requests.push(request);
			this._process();
		});
		this._socket.on("disconnect", this._disconnect);
	}

	// Poll requests and handle one by one.
	private _processing = false;
	private _process() {
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
		if (typeof request!="object") {
			this._processing = false;
			this._process();
			return;
		}
		this.processRequest(request.action).then((data)=>{
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

	private _disconnect() {
		this._socket.removeAllListeners();
		Connection._sockets = Connection._sockets.filter(s=>s!=this._socket);
		this.disconnect();
	}

	abstract disconnect(): void;
	abstract processRequest(data: IRequestAction): Promise<IResponseData>;

}
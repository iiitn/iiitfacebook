import * as SocketIO from 'socket.io';
import { IRequest, IResponse, IRequestAction, IResponseData } from '../Schema/Common';
import { MAX_FILE_SIZE } from '../Schema/FileUpload';
import { Database } from './Database';
import { UserSchema } from '../Schema/User';

// 100 KB.
export abstract class Connection {
	protected _socket: SocketIO.Socket;
	private _requests: IRequest[] = [];

	constructor(socket: SocketIO.Socket) {
		this._socket = socket;

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

		let final = ()=>{
			this._processing = false;
			this._process();
		};
		this.processRequest(request.action).then((data)=>{
			this._socket.emit("response", {
				res_id: req_id,
				data
			} as IResponse);
			final();
		}).catch((err)=>{
			this._socket.emit("response", {
				res_id: req_id,
				error: err
			} as IResponse);
			final();
		});
	}

	private _disconnect() {
		this._socket.removeAllListeners();
		this.disconnect();
	}

	abstract disconnect(): void;
	abstract processRequest(data: IRequestAction): Promise<IResponseData>;

}
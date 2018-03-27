import {connect} from 'socket.io-client';
import { Dispatch, store } from './State';
import {Promise} from 'es6-promise';
import { IResponse, IRequest, IRequestData } from 'Schema/Common';

let g_req_id = 0;
class _Socket {
	private socket: SocketIOClient.Socket;
	private _requests: {
		[req_id: number]: {
			resolve: Function,
			reject: Function
		}
	} = {};

	constructor(url="/") {
		this.socket = connect(url);

		this.socket.on("response", (response: IResponse)=>{
			console.log("Response", response);
			let res_id = response.res_id;
			if (this._requests[res_id]) {
				if (response.error) {
					console.error("RESPONSE ERROR : ", response.error);
					this._requests[res_id].reject(response.error);
				}
				else {
					console.log("RESPONSE SUCCESS : ", response.data);
					this._requests[res_id].resolve(response.data);
				}
				delete this._requests[res_id];
			}
			else {
				console.error("Serious error. No Response handler found to handle requet<->response id : ", response.res_id);
			}
		})
	}
	set onConnect(func: ()=>void) {
		this.socket.on("connect", func);
	}
	set onDisconnect(func: ()=>void) {
		this.socket.on("disconnect", func);
	}

	on(ev: string, func: ()=>void) {
		this.socket.on(ev, func);
	}
	off(ev: string, func?: any) {
		this.socket.off(ev, func);
	}

	request(data: IRequestData) {
		// Send a Socket.IO request.
		return new Promise((resolve, reject)=>{
			let rid = g_req_id++;
			this._requests[rid] = {
				resolve,
				reject
			};
			this.socket.emit("request", {
				req_id: rid,
				data: data
			} as IRequest);

			setTimeout(()=>{
				reject("Request timeout...");
			}, 5000);
		});
	}
}
export let Socket = new _Socket();
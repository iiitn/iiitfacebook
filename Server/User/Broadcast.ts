import * as SocketIO from 'socket.io';
import { UserSchema, IUserSchema, IUserCategSchema } from 'Schema/User';
import { Database } from 'Server/Database';
import { IResponseData } from 'Schema/Common';
import { UserInfo } from 'Server/User/UserInfo';


export class Broadcast {
	private userid: string;
	constructor(id: string) {
		this.userid = id;
	}

	toClass(data: IResponseData) {
		let cls_users = UserInfo.getOnlineCollegues(this.userid);
		this.passiveAction(data, cls_users);
	}
	toSelf(data: IResponseData) {
		this.passiveAction(data, [this.userid]);
	}
	passiveAction(data: IResponseData, users: string[]) {
		users.forEach(u=>{
			UserInfo.getUserSockets(u).forEach(s=>{
				s.emit("PASSIVE_ACTION", data);
			})
		})
	}
}
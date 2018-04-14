import * as SocketIO from 'socket.io';
import { IUserSchema, IUserCategSchema } from "Schema/User";
import { Database } from "Server/Database";
import _ = require('lodash');


interface IUser {
	name: IUserSchema["name"]
	gender: IUserSchema["gender"]
	batch: IUserSchema["batch"]
	branch: IUserSchema["branch"]
	cls: IUserSchema["cls"]
}
interface IUsers {
	[id: string]: IUser|undefined
}
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

class _UserInfo {
	private users: IUsers = {};
	private user_ctg: IUserCategSchema = {};

	private users_online: IOnlineUser = {};
	private user_online_ctg: IOnline_user_ctg = {};

	constructor() {
		Database.onLoad().then(()=>{
			Database.collection("user").findAll({}, {
				_id: true,
				name: true,
				gender: true,
				batch: true,
				branch: true,
				class: true
			}).then((data: IUser[])=>{
				data.forEach(u=>{
					this.users[(u as any)._id] = {
						gender: u.gender,
						name: u.name,
						batch: u.batch,
						branch: u.branch,
						cls: u.cls
					}
				})
				console.log(this.users);
			});
		});
		Database.collection("user_ctg").find("iiit").then((data)=>{
			this.user_ctg = data.byBatch;
		});
	}

	addSocket(userid: string, socket: SocketIO.Socket)
	{
		let user = this.users[userid];
		if (!user) {
			console.error("User not found in volatile database!!!");
			return;
		}
		let {cls, branch, batch} = user;
		let path = `${batch}.${branch}.c${cls}`;
		let categ = _.get(this.user_online_ctg, path) as any;
		if (categ) {
			categ = [...categ, userid];
		}else {
			categ = [userid];
		}
		_.set(this.user_online_ctg, path, categ);

		let userSockets = this.users_online[userid];
		if (userSockets) {
			userSockets.sockets.push(socket);
		}
		this.users_online[userid] = {
			sockets: [socket]
		};
	}
	rmSocket(userid: string, socket: SocketIO.Socket) {
		let user = this.users[userid];
		if (!user) {
			console.error("User details not found in volatile db.");
			return;
		}
		let {batch, branch, cls} = user;
		let path = `${batch}.${branch}.c${cls}`;
		let categ = _.get(this.user_online_ctg, path) as any;
		if (categ) {
			categ = categ.filter((u: any)=>u!=userid);
		}
		_.set(this.user_online_ctg, path, categ);

		let user_online = this.users_online[userid];
		if (user_online) {
			user_online.sockets = user_online.sockets.filter(s=>s!=socket);
			if (user_online.sockets.length==0) {
				delete this.users_online[userid];
			}
			return;
		}
		// DO NOTHING.
	}

	getNameByID(id: string) {
		let user = this.users[id];
		return user?user.name:id;
	}
	getUserDetails(id: string) {
		if (!id) {
			console.error("Couldn't find details in volatile db of user : ", id);
		}
		return this.users[id];
	}
	getUserSockets(id: string) {
		let user_online = this.users_online[id];
		if (!user_online) {
			return [];
		}
		return user_online.sockets;
	}
	getAllOnlineUsers() {
		return Object.keys(this.users_online);
	}
	getOnlineClassCollegues(id: string): string[] {
		let user = this.users[id];
		if (!user)
			return [];
		let {cls, branch, batch} = user;
		let path = `${batch}.${branch}.c${cls}`;
		let users = _.get(this.user_online_ctg, path) as any;
		return users?users:[];
	}
}
export let UserInfo = new _UserInfo();
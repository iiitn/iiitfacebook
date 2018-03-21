import {connect} from 'socket.io-client';
import { Dispatch, store } from './State';


export let Socket = connect();
let name = "kishore";//prompt("What's your name?");

Socket.on("connect", ()=>{
	Socket.send({
		type: "USER_ONLINE",
		name: name
	})
	console.log("Connected");
});
Socket.on("disconnect", ()=>{
	console.log("Disconnected");
});


Socket.on("message", (data: any)=>{
	if (data.type=="ONLINE_LIST") {
		Dispatch({
			type: "ONLINE_UPDATE",
			online: data.users,
			users: []
		});
	}
});

import * as http from "http";
import * as express from "express";
import * as path from "path";
import * as SocketIO from 'socket.io';

let App = express();
let httpServer  = new http.Server(App);

httpServer.listen(2002,()=> {
	let address = httpServer.address();
	console.log("Server listening on port  :"+ address.port);
})

App.use(express.static("./"));

App.get("*",(req,res)=>{
	res.sendFile(path.resolve("./index.html"));
});

let IO = SocketIO(httpServer);

let users: string[] = [];
IO.on("connection", (socket)=>{
	let name: string;
	socket.on("disconnect", ()=>{
		users = users.filter(u=>u!=name);
		console.log("Online List : ", users);
		IO.send({
			type: "ONLINE_LIST",
			users
		});	
	});

	socket.on("message", (action)=>{
		if (action.type=="USER_ONLINE") {
			name = action.name;
			users.push(action.name);
			console.log("Online List : ", users);
			IO.send({
				type: "ONLINE_LIST",
				users
			});
		
		}
	})
});


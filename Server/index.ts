import * as http from "http";
import * as express from "express";
import * as path from "path";
import * as SocketIO from 'socket.io';
import * as fs from 'fs';
import {Schema} from 'classui/Components/Form/Schema';
import {UserSchema} from '../Schema/User'
import { User } from "Server/User/index";

let App = express();
let httpServer  = new http.Server(App);

httpServer.listen(80,()=> {
	let address = httpServer.address();
	console.log("Server listening on port  :"+ address.port);
})

App.use(express.static("./bundle/"));

App.get("*",(req,res)=>{
	res.sendFile(path.resolve("./index.html"));
});

export let IO = SocketIO(httpServer);

let users: string[] = [];
IO.on("connection", (socket)=>{
	new User(socket);
});
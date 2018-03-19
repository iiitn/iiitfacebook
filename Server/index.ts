import  * as http from "http";
import * as express from "express";
import * as path from "path";
let App = express();
let httpServer  = new http.Server(App);

httpServer.listen(2002,()=> {
	let address = httpServer.address();
	console.log("Server listening on port  :"+ address.port);
})

App.use(express.static("./"));
App.get("*",(req,res)=>{
	res.sendfile(path.resolve("./index.html"));
})
import * as mongodb from 'mongodb';
import {Promise} from 'es6-promise';

export let Register = (data: any)=>{
	mongodb.MongoClient.connect("mongodb://127.0.0.1:27017", (err, res)=>{
		let db = res.db("iiitfb");
	
		db.collection("user").insert(data).catch(console.log);
	});
};


export let Login = (data: any)=>{
	return new Promise((resolve, reject)=>{
		mongodb.MongoClient.connect("mongodb://127.0.0.1:27017", (err, res)=>{
			let db = res.db("iiitfb");
		
			db.collection("user").findOne({
				_id: data._id
			}).then((res)=>{
				if (res.password==data.password) {
					resolve("Succesfully logged in.");
				}
				else {
					reject("Invalid credentials");
				}
			}).catch(()=>{
				reject("User not found.")
			});
		});
	})
}
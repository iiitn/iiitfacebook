import * as mongodb from 'mongodb';
import {Promise} from 'es6-promise';
import { IJSONSchema, Schema } from 'classui/Components/Form/Schema';
import _ = require('lodash');

class _Database {
	private _database?: mongodb.Db;
	constructor(db: string) {
		mongodb.MongoClient.connect("mongodb://127.0.0.1:27017", (err, res)=>{
			if (err) {
				console.log("Couldn't connect to database.");
				return;
			}
			this._database = res.db(db);
		});
	}
	collection(name: string) {
		return new Collection(name, this._database);
	}
}

class Collection {
	collection?: mongodb.Collection<any>;
	constructor(name: string, db?: mongodb.Db) {
		if (db) {
			this.collection = db.collection(name);
		}
	}

	insert(data: any, schema: IJSONSchema) {
		return new Promise((resolve, reject)=>{
			if (!this.collection) {
				return reject("Couldn't connect to database.");
			}
			let error = Schema.validate(schema, data);
			if (error!=null) {
				// Error is there inserting document.
				reject("Invalid Data format. Please check the format.");
			}
			this.collection.insertOne(data).catch(()=>{
				reject("Error inserting the document.");
			}).then(()=>{
				resolve("Successfully inserted the document.");
			})
		})
	}
	find(_id: string) {
		return new Promise<any>((resolve, reject)=>{
			if (!this.collection) {
				return reject("Couldn't connect to database.");
			}
			this.collection.findOne({
				_id
			}).then((d: any)=>{
				if (!d) {
					return reject("Document not found.");
				}
				resolve(d);
			}).catch(()=>{
				reject("Error getting the document.");
			});
		});
	}
	findAll(criteria: any, fields?: {[id: string]: boolean}) {
		return new Promise<any>((resolve, reject)=>{
			if (!this.collection) {
				return reject("Couldn't connect to database.");
			}
			let query: mongodb.Cursor<any>;
			if (_.isArray(criteria)) {
				query = this.collection.find({
					_id: {
						$in: criteria
					}
				});
			}
			else {
				query = this.collection.find(criteria, {
					projection: fields
				});
			}
			query.toArray((err, docs)=>{
				if (err) {
					return reject("Error getting documents from collection.");
				}
				resolve(docs);
			});
		});
	}
	updateKey(id: string, key: string, data: any) {
		return new Promise<any>((resolve, reject)=>{
			if (!this.collection) {
				return reject("Couldn't connect to database.");
			}
			this.collection.update({
				_id: id
			}, {
				'$set': {
					[key]: data
				}
			}).then(()=>{
				return resolve("Succesfully updated");
			});
		});
	}
	addItem(find: any, key: string, data: any) {
		return new Promise<any>((resolve, reject)=>{
			if (!this.collection) {
				return reject("Couldn't connect to database");
			}
			this.collection.update(find, {
				$addToSet: {
					[key]: data
				}
			}, {
				upsert: true
			}).then(()=>{
				resolve("Success.");
			}).catch(()=>{
				reject("Failure");
			});
		})
	}
}

export let Database = new _Database("iiitfb");
import * as mongodb from 'mongodb';
import { IJSONSchema, Schema } from 'classui/Components/Form/Schema';
import _ = require('lodash');

class _Database {
	private _database?: mongodb.Db;
	private promise: Promise<any>;
	constructor(db: string) {
		this.promise = new Promise((resolve, reject)=>{
			mongodb.MongoClient.connect("mongodb://127.0.0.1:27017", (err, res)=>{
				if (err) {
					return reject("Couldn't connect to database");
				}
				this._database = res.db(db);
				resolve(this._database);
			});
		})
	}
	onLoad() {
		return this.promise;
	}
	collection(name: string) {
		return new Collection(name, this._database);
	}
}

export class Collection {
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
				reject("Invalid Data format. "+error);
			}
			this.collection.insertOne(data).catch(()=>{
				reject("Error inserting the document.");
			}).then(()=>{
				resolve("Successfully inserted the document.");
			})
		})
	}
	remove(_id: string) {
		return new Promise<any>((resolve, reject)=>{
			if (!this.collection) {
				return reject("Couldn't connect to database.");
			}
			this.collection.remove({
				_id
			}).then((d: any)=>{
				resolve("Successfully removed document");
			}).catch(()=>{
				reject("Error removing document.");
			});
		});
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
	appendItem(_id: string, key: string, data: any) {
		return new Promise<any>((resolve, reject)=>{
			if (!this.collection) {
				return reject("Couldn't connect to database");
			}
			this.collection.update({_id}, {
				$push: {
					[key]: data
				}
			}).then(()=>{
				resolve("Success.");
			}).catch(()=>{
				reject("Failure");
			});
		})
	}
	prependItem(_id: string, key: string, data: any) {
		return new Promise<any>((resolve, reject)=>{
			if (!this.collection) {
				return reject("Couldn't connect to database");
			}
			this.collection.update({_id}, {
				$push: {
					[key]: {
						$each: [data],
						$position: 0
					}
				}
			}).then(()=>{
				resolve("Success.");
			}).catch(()=>{
				reject("Failure");
			});
		})
	}
	addItemToSet(_id: string, key: string, data: any) {
		return new Promise<any>((resolve, reject)=>{
			if (!this.collection) {
				return reject("Couldn't connect to database");
			}
			this.collection.update({_id}, {
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
	removeItem(_id: string, key: string, data: any) {
		return new Promise<any>((resolve, reject)=>{
			if (!this.collection) {
				return reject("Couldn't connect to database");
			}
			this.collection.update({_id}, {
				$pull: {
					[key]: data
				}
			}).then(()=>{
				resolve("Success.");
			}).catch(()=>{
				reject("Failure");
			});
		})
	}
}

export let Database = new _Database("iiitfb");
import { Database, Collection } from "Server/Database";
import { v4 } from "uuid";
import { IWallSchema, WallSchema } from "Schema/Wall";
import { UserSchema, IUserSchema } from "Schema/User";
import { UserInfo } from "Server/User/UserInfo";


export class UserActions {
	wall_db = Database.collection("wall");
	user_db = Database.collection("user");
	user_ctg_db = Database.collection("user_ctg");
	timeline_db = Database.collection("timeline");

	userid: string;

	constructor(userid: string) {
		this.userid = userid;
		Database.onLoad().then(()=>{
			this.wall_db = Database.collection("wall");
			this.user_db = Database.collection("user");
			this.user_ctg_db = Database.collection("user_ctg");
		})
	}

	static login(data: any) {
		return Database.collection("user").find(data._id).then((udata: IUserSchema)=>{
			if (udata.password==data.password) {
				return Promise.resolve(udata);
			}
			return Promise.reject("Login Failed.");
		}).catch(()=>Promise.reject("LOgin Failed"));

	}
	static register(data: IUserSchema) {
		return Promise.all([
			Database.collection("user").insert(data, UserSchema),
			Database.collection("user_ctg")
				.addItemToSet("iiit", `byBatch.${data.batch}.${data.branch}.${data.cls}`, data._id)
		])
			.then(()=>Promise.resolve("User Successfully registered."))
			.catch(()=>Promise.reject("Unknown error in database while registering."));
	}

	// Wall related functionality goes here.
	wall_add(content: string) {
		let wallid = v4();
		let wall: IWallSchema = {
			_id: wallid,
			postedOn: new Date().getTime(),
			comments: [],
			postedBy: this.userid,
			content,
			likes: []
		};
		let userDetails = UserInfo.getUserDetails(this.userid);
		if (!userDetails)
			return Promise.reject("Couldn't add wall.");
		return Promise.all([
			this.wall_db.insert(wall, WallSchema),
			this.user_db.addItemToSet(this.userid, "walls_posted", wallid),
			this.timeline_db.prependItem("iiit", `byBatch.${userDetails.batch}.${userDetails.branch}.${userDetails.cls}._posts` , wallid)
		]).then(()=>{
			return wall;
		}).catch(()=>{
			return Promise.reject("Couldn't post wall.");
		});
	}
	wall_delete(wall_id: string) {
		return Promise.all([
			this.wall_db.remove(wall_id),
			this.user_db.removeItem(this.userid, "walls_posted", wall_id)
		]).then(()=>Promise.resolve("Successfully deleted"))
		.catch(()=>Promise.reject("Failed to delete wall."));
	}
	wall_like(wall_id: string) {
		return Promise.all([
			this.wall_db.addItemToSet(wall_id, "likes", this.userid),
			this.user_db.addItemToSet(this.userid, "walls_liked", wall_id)
		]).then(()=>Promise.resolve("Successfully Liked the wall"))
		.catch(()=>Promise.reject("Failed to Like wall."));
	}
	wall_unlike(wall_id: string) {
		return Promise.all([
			this.wall_db.removeItem(wall_id, "likes", this.userid),
			this.user_db.removeItem(this.userid, "walls_liked", wall_id)
		]).then(()=>Promise.resolve("Successfully unLiked the wall"))
		.catch(()=>Promise.reject("Failed to unLike wall."));
	}
}
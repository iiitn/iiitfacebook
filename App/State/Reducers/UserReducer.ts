interface IUser {
	name: string
	id: string
}
export interface ICollegueDetails {
	[id: string]: {
		name: string
	}|undefined
}

export interface IUserState {
	userid?: string
	online: IUser[]
	collegueDetails: ICollegueDetails

	all_posts: string[] // Posts from all over IIITN.

	cls_posts: string[] // Or Posts from collegues!!!
	branch_posts: string[]
	batch_posts: string[]

	walls_posted: string[]
	walls_liked: string[]
}

let defaultState: IUserState = {
	userid: undefined,
	collegueDetails: {},
	online: [],

	all_posts: [],

	cls_posts: [],
	branch_posts: [],
	batch_posts: [],
	
	walls_posted: [],
	walls_liked: []
};
export type IUserAction = {
	type: "USER_LOGIN",
	userid: string
	collegueDetails: ICollegueDetails
} | {
	type: "USER_LOGOUT"
} | {
	type: "USER_WALL_ADD_ID"
	post_id: string
} | {
	type: "ONLINE_UPDATE"
	online: IUserState["online"]
};;

export let UserReducer = (state=defaultState, action: IUserAction)=>{
	switch(action.type) {
		case "USER_LOGIN": {
			state = {
				...state,
				userid: action.userid,
				collegueDetails: action.collegueDetails
			};
			break;
		}
		case "USER_LOGOUT": {
			state = {
				...state,
				userid: undefined
			};
			break;
		}
		case "USER_WALL_ADD_ID": {
			state = {
				...state,
				all_posts: [
					...state.all_posts,
					action.post_id
				]
			};
			break;
		}
		case "ONLINE_UPDATE": {
			state = {
				...state,
				online: action.online.filter(u=>u.id!=state.userid)
			};
			break;
		}
	}
	return state;
}
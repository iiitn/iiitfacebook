interface IOnlineUser {
	name: string
	id: string
}

export interface IUserState {
	userid?: string
	online: IOnlineUser[]

	all_posts: string[]
	walls_posted: string[]
	walls_liked: string[]
}

let defaultState: IUserState = {
	userid: undefined,
	online: [],

	all_posts: [],
	walls_posted: [],
	walls_liked: []
};
export type IUserAction = {
	type: "USER_LOGIN",
	userid: string
} | {
	type: "USER_LOGOUT"
} | {
	type: "ADD_POST"
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
				userid: action.userid
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
		case "ADD_POST": {
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
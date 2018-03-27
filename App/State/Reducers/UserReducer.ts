
export interface IUserState {
	userid?: string
}

let defaultState: IUserState = {
	userid: undefined
};
export type IUserAction = {
	type: "USER_LOGIN",
	userid: string
} | {
	type: "USER_LOGOUT"
};

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
	}
	return state;
}
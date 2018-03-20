
export interface IOnlineState {
	users: string[]
	online: string[]
}

let defaultState: IOnlineState = {
	users: [],
	online: []
};
export type IOnlineAction = {
	type: "ONLINE_UPDATE"
	users: string[]
	online: string[]
};

export let OnlineReducer = (state=defaultState, action: IOnlineAction) => {
	switch(action.type) {
		case "ONLINE_UPDATE": {
			state = {
				...state,
				online: action.online,
				users: action.users
			};
			break;
		}
	}
	return state;
};
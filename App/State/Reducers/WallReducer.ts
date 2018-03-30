export interface IWallState {
	[id:string]: {
		postedOn : string
		postedBy : string
		content : string
		liked : boolean
		nLikes : number
		comments : {
			cid : string
			liked  :boolean
			text : string
		}[]
	}
}

export type IWallAction = {
	type : "WALL_ADD"
	id : string
	content : string
	postedBy  :string
	postedOn : string
} | {
	type : "WALL_LIKE"
	id : string
} | {
	type : "WALL_DELETE"
	id : string
}  | {
	type : "WALL_EDIT"
	id : string
	content : string
} | {
	type : "WALL_COMMENT_ADD"
	id : string
	text : string
} | {
	type : "WALL_COMMENT_DELETE"
	id : string
	cid : string
} | {
	type : "WALL_COMMENT_EDIT"
	id : string
	cid : string
	text  :string
} | {
	type : "WALL_COMMENT_LIKE"
	id : string
	cid : string
}

let defaultState:IWallState = {
	
} 

export let WallReducer = (state : IWallState = defaultState, action : IWallAction)=> {
	switch(action.type) {
		case "WALL_ADD" : {
			state = {
				...state,
				[action.id] : {
					content : action.content,
					liked : false,
					nLikes : 0, 
					postedBy : action.postedBy,
					postedOn : action.postedOn,
					comments : []
				}
			}
			break;
		}
		case "WALL_DELETE" : {
			delete state[action.id];
			state = {...state};
			break;
		}
		case "WALL_LIKE" : {
			state = {
				...state,
				[action.id] : {
					...state[action.id],
					liked : !state[action.id].liked
				}
			}
		}
		break;
	}
	return state;
 }
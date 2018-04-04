import {combineReducers} from 'redux';
import { UserReducer, IUserState, IUserAction } from 'App/State/Reducers/UserReducer';
import { IWallsState, IWallAction, WallReducer } from 'App/State/Reducers/WallReducer';
export interface IRootState {
	user: IUserState
	walls: IWallsState
};

export type IAction = IUserAction | IWallAction;

export let RootReducer = combineReducers<IRootState>({
	user: UserReducer as any,
	walls: WallReducer as any
});
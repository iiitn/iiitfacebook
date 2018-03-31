import {combineReducers} from 'redux';
import {IOnlineAction, IOnlineState, OnlineReducer} from './OnlineReducer';
import { UserReducer, IUserState, IUserAction } from 'App/State/Reducers/UserReducer';
import { IWallsState, IWallAction, WallReducer } from 'App/State/Reducers/WallReducer';
export interface IRootState {
	online: IOnlineState
	user: IUserState
	walls: IWallsState
};

export type IAction = IOnlineAction | IUserAction | IWallAction;

export let RootReducer = combineReducers<IRootState>({
	online: OnlineReducer as any,
	user: UserReducer as any,
	walls: WallReducer as any
});
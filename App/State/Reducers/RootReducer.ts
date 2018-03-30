import {combineReducers} from 'redux';
import {IOnlineAction, IOnlineState, OnlineReducer} from './OnlineReducer';
import { UserReducer, IUserState, IUserAction } from 'App/State/Reducers/UserReducer';
import { IWallState, IWallAction, WallReducer } from 'App/State/Reducers/WallReducer';
export interface IState {
	online: IOnlineState
	user: IUserState
	walls: IWallState
};

export type IAction = IOnlineAction | IUserAction | IWallAction;

export let RootReducer = combineReducers<IState>({
	online: OnlineReducer as any,
	user: UserReducer as any,
	walls: WallReducer as any
});
import {combineReducers} from 'redux';
import {IOnlineAction, IOnlineState, OnlineReducer} from './OnlineReducer';
import { UserReducer, IUserState, IUserAction } from 'App/State/Reducers/UserReducer';
export interface IState {
	online: IOnlineState
	user: IUserState
};

export type IAction = IOnlineAction | IUserAction;

export let RootReducer = combineReducers<IState>({
	online: OnlineReducer as any,
	user: UserReducer as any
});
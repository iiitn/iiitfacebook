import {combineReducers} from 'redux';
import {IOnlineAction, IOnlineState, OnlineReducer} from './OnlineReducer';
export interface IState {
	online: IOnlineState
};

export type IAction = IOnlineAction;

export let RootReducer = combineReducers<IState>({
	online: OnlineReducer as any
});
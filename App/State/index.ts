import {IState, IAction, RootReducer} from './Reducers/RootReducer';
import {createStore} from 'redux';

export {IState} from './Reducers/RootReducer';

export let store = createStore<IState>(RootReducer);

export let Dispatcher = (action: IAction)=>{
	store.dispatch(action);
}
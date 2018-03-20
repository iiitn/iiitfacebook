import {IState, IAction, RootReducer} from './Reducers/RootReducer';
import {createStore} from 'redux';

export {IState} from './Reducers/RootReducer';

export let store = createStore<IState>(RootReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

export let Dispatch = (action: IAction)=>{
	store.dispatch(action);
}
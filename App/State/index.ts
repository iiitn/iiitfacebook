import {IRootState, IAction, RootReducer} from './Reducers/RootReducer';
import {createStore} from 'redux';

export {IRootState} from './Reducers/RootReducer';

export let store = createStore<IRootState>(RootReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

export let Dispatch = (action: IAction)=>{
	store.dispatch(action);
}
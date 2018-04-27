import {IRootState, IAction, RootReducer} from './Reducers/RootReducer';
import {createStore} from 'redux';
import _ = require('lodash');

export {IRootState} from './Reducers/RootReducer';

export let store = createStore<IRootState, IAction, {}, {}>(RootReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

export let Dispatch = _.throttle((action: IAction)=>{
	store.dispatch(action);
}, 100);

export let StateUtils = {
	getNameByID(id: string, name=id) {
		let user = store.getState().user.collegueDetails[id];
		if (user) {
			return user.name;
		}
		return name;
	}
}
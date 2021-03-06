import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI, NavBar, NavbarRemain} from 'classui/';
import { Route, Switch } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { Dispatch, store } from './State';
import { Provider } from 'react-redux';
import { css } from 'classui/Emotion';


interface IProps {};
export class App extends React.Component<IProps, any>
{
	render()
	{
		return <Provider store={store}>
		<ClassUI className={css`
			display: flex;
			flex-direction: column;
		`} fullHeight EnableRouting theme="offline">
			<Switch>
				<Route exact path="/home" component={Home}/>
				<Route component={Login}/>
			</Switch>
		</ClassUI>
		</Provider>
	}
};
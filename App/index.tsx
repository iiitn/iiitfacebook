import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI, NavBar, NavbarRemain} from 'classui/';
import { Route, Switch } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';

interface IProps {};
export class App extends React.Component<IProps, any>
{
	render()
	{
		return <ClassUI className="classbook" fullHeight EnableRouting>
			<Switch>
				<Route exact path="/home" component={Home}/>
				<Route component={Login}/>
			</Switch>
		</ClassUI>
	}
}
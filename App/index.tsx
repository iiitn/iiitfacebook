import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI, NavBar, NavbarRemain} from 'classui/';
import {Button} from 'classui/Components/';
import { Route, Switch } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { Profile } from './Pages/Profile';

interface IProps {};
export class App extends React.Component<IProps, any>
{
	render()
	{
		return <ClassUI className="classbook" fullHeight EnableRouting>
			<Switch>
				<Route exact path="/home" component={Home}/>
				<Route exact path="/profile" component={Profile}/>
				<Route component={Login}/>
			</Switch>
		</ClassUI>
	}
}
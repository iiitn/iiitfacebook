import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI, NavBar, NavbarRemain} from 'classui/';
import { Route, Switch } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import {connect} from 'socket.io-client';
import { Dispatch, store } from './State';
import { Provider } from 'react-redux';


interface IProps {};
export class App extends React.Component<IProps, any>
{
	render()
	{
		return <Provider store={store}>
		<ClassUI className="classbook" fullHeight EnableRouting>
			<Switch>
				<Route exact path="/home" component={Home}/>
				<Route component={Login}/>
			</Switch>
		</ClassUI>
		</Provider>
	}
};

let Socket = connect();
let name = prompt("What's your name?");

Socket.on("connect", ()=>{
	Socket.send({
		type: "USER_ONLINE",
		name: name
	})
	console.log("Connected");
});
Socket.on("disconnect", ()=>{
	console.log("Disconnected");
});


Socket.on("message", (data: any)=>{
	if (data.type=="ONLINE_LIST") {
		Dispatch({
			type: "ONLINE_UPDATE",
			online: data.users,
			users: []
		});
	}
});
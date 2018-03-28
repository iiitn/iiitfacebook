import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './App';
import { Socket } from 'App/Network';
import { Dispatch } from 'App/State';
import { ClassUI } from 'classui/ClassUI';

Socket.onConnect = ()=>ClassUI.setTheme("fb");
Socket.onDisconnect = ()=>ClassUI.setTheme("green");
Socket.on("PASSIVE_ACTION", (data: any)=>{
	Dispatch(data);
});
ReactDOM.render(<App />, document.getElementById("app"));
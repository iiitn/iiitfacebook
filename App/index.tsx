import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './App';
import { Socket } from 'App/Network';
import { Dispatch } from 'App/State';
import { ClassUI } from 'classui/ClassUI';
import { PassiveAction } from 'App/PassiveAction';
import 'es6-promise/auto';

Socket.onConnect = ()=>ClassUI.setTheme("flat");
Socket.onDisconnect = ()=>ClassUI.setTheme("offline");
Socket.onPassiveAction = (data: any)=>{
	Dispatch(data);
	PassiveAction(data);
};
ReactDOM.render(<App />, document.getElementById("app"));
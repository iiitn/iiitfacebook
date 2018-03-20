import * as React from 'react';
import { Div } from 'classui/Components';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { IState } from '../../State';

interface IOnlineProps {
	className?: string
	users: string[]
}

let _OnlineList = (props: IOnlineProps)=>{
	return <Div card="2" className={classNames("component_onlineList", props.className)}>
		<h3 className="title">Online List</h3>
		<hr style={{opacity: 0.3}}/>
		{
			props.users.map(u=>
				<div key={u} className="item">{u}</div>
			)
		}
		<div className="item online">Kishore</div>
	</Div>;
}

export let OnlineList = connect((state: IState)=>{
	return {
		users: state.online.online
	}
})(_OnlineList);
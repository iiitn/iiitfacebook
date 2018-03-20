import * as React from 'react';
import { Div } from 'classui/Components';
import * as classNames from 'classnames';

interface IOnlineProps {
	className?: string
}

export let OnlineList = (props: IOnlineProps)=>{
	return <Div card="2" className={classNames("component_onlineList", props.className)}>
		<h3 className="title">Online List</h3>
		<hr style={{opacity: 0.3}}/>
		<div className="item online">Kishore</div>
		<div className="item">Kittu</div>
	</Div>;
}
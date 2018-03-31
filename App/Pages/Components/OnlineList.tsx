import * as React from 'react';
import { Div } from 'classui/Components';
import {cx, css, styled, Hoverable} from 'classui/Emotion/index';
import { connect } from 'react-redux';
import { IRootState } from '../../State';
import { BaseComponentProps } from 'classui/Components/BaseComponent';
import { Socket } from 'App/Network';

interface IOnlineProps {
	className?: string
	users: string[]
}

let EItem = styled('div')`
	font-size: 13px;
	padding: 10px;
	&.online {
		font-weight: 900;
		color: green;
	}
`;
let Title = styled('h3')`
	padding-left: 10px;
`;
let _OnlineList = (props: IOnlineProps)=>{
	return <Div card="2" className={cx(css`
			background-color: white;
		`, props.className)}>
		<Title>Online List</Title>
		<hr style={{opacity: 0.3}}/>
		{
			props.users.map(u=>
				<EItem key={u} onClick={()=>{
					Socket.request({
						type: "SEND_MESSAGE",
						userid: u
					});
				}} className={cx(Hoverable(), {
				})}>{u}</EItem>
			)
		}
	</Div>;
}

export let OnlineList = connect((state: IRootState)=>{
	return {
		users: state.online.online
	}
})(_OnlineList);
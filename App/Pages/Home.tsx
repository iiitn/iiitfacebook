import * as React from "react";
import { NavBar, NavbarRemain } from "classui";
import { Button, Div, TextField } from "classui/Components";
import { Overlay } from 'classui/Overlay';
import { Dropdown, DItem } from "classui/Components/Dropdown";
import { Wall } from "./Components/Wall";
import {AutoTextarea} from './Components/AutoTextarea';
import { OnlineList } from "./Components/OnlineList";
import { styled, css } from "classui/Emotion";
import { connect } from "react-redux";
import { IRootState, Dispatch, StateUtils } from "App/State";
import { Socket } from "App/Network";
import _ = require("lodash");

let onlineWidth = 200;
let navbar = css`
	position: fixed;
	padding-right: ${onlineWidth}px;

	@media (max-width: 600px) {
		padding-right: 0px;
	}
`
let HomePage = styled('div')`
	display: flex;
	> .walls {
		max-width: 500px;
		width: 100%;
		margin: auto;
	}
`;
let Content = styled('div')`
	flex-grow: 1;
	margin-right: ${onlineWidth}px;
	@media (max-width: 600px) {
		margin-right: 0px;
	}
`;
let MContent = styled('div')`
	width: 100%;
	max-width: 400px;
	margin: auto;
`;
let onlineCss = css`
	position: fixed;
	right: 0px;
	padding-top: 60px;
	height: 100vh;
	top: 0px;
	width: ${onlineWidth}px;

	@media (max-width: 600px) {
		display: none;
	}
`;

interface IHomeProps {
	userid: IRootState["user"]["userid"]
	allPosts: IRootState["user"]["all_posts"]
}
let _Home = (props: IHomeProps)=>{
	return <>
		<NavBar logo="IIITFacebook" className={navbar} width={1024} dummy>
			<NavbarRemain />
			<Button to="/home">
			<i className="fa fa-home"  style={{paddingRight: 5}}/>Home
			</Button>
			{props.userid?
			<Button>
				<i className="fa fa-user" style={{paddingRight: 5}}/>
				{StateUtils.getNameByID(props.userid)}
			</Button>:undefined}
			<Button to="/login" onClick={()=>{
				Socket.request({
					type: "USER_LOGOUT"
				}).then((action: any)=>{
					Dispatch(action);
				})
			}}>
				{props.userid?"Logout":"Login"}
			</Button>
		</NavBar>
		<Content>
			<MContent>
				<div style={{textAlign: "right"}}>
					<AutoTextarea className={css`
						padding: 10px;
						line-height: 1.4;
						font-family: Arial;
						font-size: 13px;
						width: 100%;
						min-height: 50px;
						border: 1px solid grey;
					`} onCtrlEnter={(value, ref)=>{
						Socket.request({
							type: "WALL_ADD",
							content: value
						}).then(()=>{
							ref.setState({
								value: ""
							});
						}).catch((err)=>{
							Overlay.feedback(err, "error");
						})
					}}/>
					<Button primary>Post</Button>
				</div>
				{props.allPosts.map(p=>{
					return <Wall wallid={p}/>
				})}
			</MContent>
		</Content>
		<OnlineList className={onlineCss}/>
	</>;
}
export let Home = connect((state: IRootState)=>{
	return {
		userid: state.user.userid,
		allPosts: _.reverse(state.user.all_posts)
	}
})(_Home);
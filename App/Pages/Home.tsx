import * as React from "react";
import { NavBar, NavbarRemain } from "classui";
import { Button, Div, TextField } from "classui/Components";
import { Dropdown, DItem } from "classui/Components/Dropdown";
import { Wall } from "./Components/Wall";
import { OnlineList } from "./Components/OnlineList";
import { styled, css } from "classui/Emotion";
import { connect } from "react-redux";
import { IState, Dispatch } from "App/State";
import { Socket } from "App/Network";

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
	max-width: 1024px;
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
	userid: IState["user"]["userid"]
}
let _Home = (props: IHomeProps)=>{
	return <>
		<NavBar logo="IIITFacebook" className={navbar} width={1024} dummy>
			<NavbarRemain />
			<Button to="/home">
				Home
			</Button>
			<Button to="/login" onClick={()=>{
				Socket.request({
					type: "USER_LOGOUT"
				}).then((action: any)=>{
					Dispatch(action);
				})
			}}>
				{props.userid?"Logout : "+props.userid:"Login"}
			</Button>
		</NavBar>
		<Content>
			<MContent>
				<Wall className={css`
					margin: auto;
					width: 100%;
					max-width: 400px;
				`}/>
			</MContent>
		</Content>
		<OnlineList className={onlineCss}/>
	</>;
}
export let Home = connect((state: IState)=>{
	return {
		userid: state.user.userid
	}
})(_Home);
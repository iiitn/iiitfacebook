import * as React from "react";
import { NavBar, NavbarRemain } from "classui";
import { Button, Div, TextField } from "classui/Components";
import { Dropdown, DItem } from "classui/Components/Dropdown";
import { Wall } from "./Components/Wall";
import { OnlineList } from "./Components/OnlineList";

export let Home = (props: any)=>{
	return <>
		<NavBar logo="IIITFacebook" width={1024}>
			<NavbarRemain />
			<Button to="/home">
				Home
			</Button>
			<Button to="/login">
				Login
			</Button>
		</NavBar>
		<div className="homePage">
			<div className="walls">
				{/*<Wall />*/}
			</div>
			<OnlineList className="onlineList"/>
		</div>
	</>;
}
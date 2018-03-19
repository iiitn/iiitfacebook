import * as React from "react";
import { NavBar, NavbarRemain } from "classui";
import { Button, Div, TextField } from "classui/Components";
import { Dropdown, DItem } from "classui/Components/Dropdown";
import { Wall } from "./Components/Wall";

export let Home = (props: any)=>{
	return <>
		<NavBar logo="IIITFacebook" width={1024}>
			<NavbarRemain />
			<Button to="/home">
				Home
			</Button>
			<Button to="/Profile">
				Profile
			</Button>
			<Button to="/login">
				Login
			</Button>
		</NavBar>
		<div className="homePage">
			<div className="walls">
				<Wall />
			</div>
			<Div card="2" className="onlineList component_onlineList">
				<h3 className="title">Online List</h3>
				<hr style={{opacity: 0.3}}/>
				<div className="item online">Kishore</div>
				<div className="item">Kittu</div>
			</Div>
		</div>
	</>;
}
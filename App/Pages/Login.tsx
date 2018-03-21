import * as React from "react";
import { NavBar, NavbarRemain } from "classui";
import { Button, Div, TextField, Feedback } from "classui/Components";
import { Form, Checkbox, Radio } from "classui/Components/Form";
import { UserSchema } from "../../Schema/User";
import { Socket } from "../Network";

Socket.emit("register", undefined);
Socket.on("register", (data: any)=>{
	if (data.error) {
		Feedback.show(data.error, "error");
	}
	else {
		Feedback.show(data.success, "success")
	}
})
Socket.on("login", (data: any)=>{
	if (data.error) {
		Feedback.show(data.error, "error");
	}
	else {
		Feedback.show(data.success, "success")
	}
})
Socket.emit("login", {
	_id: "N090041",
	password: "iiitn123"
});;

export let Login = (props: any)=>{
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
		<div className="loginPage">
			<Div card="2" className="login">
				<Form onSubmit={(login: any)=>{
					alert(login);
					
				}}>
					<h3 className="title">Login</h3>
					<TextField name="_id">
						Username
					</TextField>
					<TextField name="Password">
						Password
					</TextField>
					<input type="submit" value="Login" />
				</Form>
			</Div>
			<Div card="2" className="register">
				<Form schema={UserSchema} onSubmit={(data: any)=>{
				}}>
					<h3 className="title">Register</h3>
					<TextField name="_id" label="Username" />
					<TextField name="name" label="Name"></TextField>
					<TextField name="password" label="Password" type="password"></TextField>
					<Div style={{marginBottom: 10}}>
						<Radio name="gender" inline values={[
							{label: "Male", value: "male"},
							{label: "Female", value: "female"}
						]} />
					</Div>
					<input type="submit" value="Register" />
				</Form>
			</Div>
		</div>
	</>;
}
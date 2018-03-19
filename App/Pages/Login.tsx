import * as React from "react";
import { NavBar, NavbarRemain } from "classui";
import { Button, Div, TextField } from "classui/Components";
import { Form, Checkbox, Radio } from "classui/Components/Form";

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
				<Form>
					<h3 className="title">Login</h3>
					<TextField name="username">
						Username
					</TextField>
					<TextField name="Password">
						Password
					</TextField>
					<input type="submit" value="Login" />
				</Form>
			</Div>
			<Div card="2" className="register">
				<Form schema={{
					type: "object",
					properties: {
						username: {
							default: "",
							type: "string",
							minLength: 3
						},
						password: {
							default: "Hello",
							type: "string",
							minLength: 5
						},
						cnfPassword: {
							type: "string"
						}
					}
				}}>
					<h3 className="title">Register</h3>
					<TextField name="username" label="Username" />
					<TextField name="name" label="Name"></TextField>
					<TextField name="password" label="Password" type="password"></TextField>
					<TextField name="cnfPassword" label="Confirm Password" type="password"></TextField>
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
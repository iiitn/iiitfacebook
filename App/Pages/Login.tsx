import * as React from "react";
import { NavBar, NavbarRemain, ClassUI } from "classui";
import { Button, Div, TextField, Feedback } from "classui/Components";
import { Form, Checkbox, Radio, Select } from "classui/Components/Form";
import { Submit } from 'classui/Components/Form/Submit';
import { UserSchema } from "../../Schema/User";
import { Socket } from "../Network";
import { styled, css } from "classui/Emotion";
import { Dispatch } from "App/State";

let LoginPage = styled('div')`
	max-width: 1024px;
	width: 100%;
	margin: auto;
	flex-grow: 1;
	display: flex;
	@media (max-width: 600px) {
		flex-direction: column;
	}
	align-items: center;
	justify-content: center;
`;
let form = css`
	background-color: white;
	padding: 20px;
	max-width: 250px;
	width: 100%;
	margin: 20px;
	text-align: left;
	h3 {
		margin-bottom: 20px;
	}
`;

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
		<LoginPage>
			<Div card="2" className={form}>
				<Form onSubmit={(data: any)=>{
					console.log(data);
					Socket.request({
						type: "USER_LOGIN",
						...data
					}).then((action: any)=>{
						ClassUI.history.push("/home");
						Dispatch(action);
					}).catch((msg)=>{
						Feedback.show(msg, "error");
					});
				}}>
					<h3>Login</h3>
					<TextField name="_id">
						University ID
					</TextField>
					<TextField type="password" name="password">
						Password
					</TextField>
					<Submit />
				</Form>
			</Div>
			<Div card="2" className={form}>
				<Form schema={UserSchema} onSubmit={(data: any)=>{
					Socket.request({
						type: "USER_REGISTER",
						...data
					}).then((msg)=>{
						Feedback.show(msg as string, "success");
					}).catch((msg)=>{
						Feedback.show(msg, "error");
					});
				}}>
					<h3>Register</h3>
					<TextField name="_id" label="University ID" />
					<TextField name="name" label="Name"></TextField>
					<Select label="Batch" name="batch" nonEditable options={(UserSchema as any).properties["batch"].enum}></Select>
					<Select label="Branch" name="branch" inline width="50%" nonEditable options={(UserSchema as any).properties["branch"].enum}></Select>
					<Select label="Class" name="class" inline width="50%" nonEditable options={(UserSchema as any).properties["class"].enum}></Select>
					<TextField name="password" label="Password" type="password"></TextField>
					<Div style={{marginBottom: 10}}>
						<Radio name="gender" inline values={[
							{label: "Male", value: "male"},
							{label: "Female", value: "female"}
						]} />
					</Div>
					<Checkbox name="agree">I agree to terms and conditions.</Checkbox>
					<Submit/>
				</Form>
			</Div>
		</LoginPage>
	</>;
}
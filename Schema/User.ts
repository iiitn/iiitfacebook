import {IJSONSchema} from 'classui/Components/Form/Schema';

export let UserSchema: IJSONSchema = {
	type: "object",
	properties: {
		_id: {
			type: "string"
		},
		name: {
			type: "string"
		},
		password: {
			type: "string",
			minLength: 5
		},
		gender: {
			type: "string"
		}
	},
	required: ["_id", "name", "password", "gender"]
}

interface IUserSchema {
	username: string
	name: string
	password: string
	age: number
}
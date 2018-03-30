import {IJSONSchema} from 'classui/Components/Form/Schema';

export let UserSchema: IJSONSchema = {
	type: "object",
	additionalProperties: false,
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
		batch: {
			enum: ["2008", "2009", "2010", "2011", "2012", "2013", "2015"]
		},
		branch: {
			enum: ["CSE", "ECE", "MECHANICAL", "CHEMICAL", "MME", "CIVIL"]
		},
		class: {
			enum: [1,2,3,4,5,6]
		},
		gender: {
			enum: ["male", "female"]
		}
	},
	required: ["_id", "name", "password", "gender", "batch", "branch", "class"]
}

interface IUserSchema {
	_id: string
	name: string
	password: string
	gender: "male"|"female"
}
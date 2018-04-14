import {IJSONSchema} from 'classui/Components/Form/Schema';

export let UserSchema: IJSONSchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		_id: {
			type: "string",
			pattern: "^N[0-9]{6}$"
		},
		name: {
			type: "string"
		},
		password: {
			type: "string",
			minLength: 5
		},
		batch: {
			enum: ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
		},
		branch: {
			enum: ["CSE", "ECE", "MECHANICAL", "CHEMICAL", "MME", "CIVIL"]
		},
		cls: {
			enum: [1,2,3,4,5,6]
		},
		gender: {
			enum: ["male", "female"]
		}
	},
	required: ["_id", "name", "password", "gender", "batch", "branch", "cls"]
}

export interface IUserSchema {
	_id: string
	name: string
	password: string
	gender: "male"|"female"
	batch: "2008" | "2009" | "2010" | "2011" | "2012" | "2013" | "2014" | "2015"
	cls: 1|2|3|4|5|6
	branch: "CSE" | "ECE" | "MECHANICAL" | "CHEMICAL" | "MME" | "CIVIL"
}

export interface IUserCategSchema {
	[batch: string]: {
		[branch: string]: {
			[cls: string]: string[]
		}
	}
}
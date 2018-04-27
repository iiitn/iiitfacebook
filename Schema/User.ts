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
			enum: ["C1", "C2", "C3", "C4", "C5", "C6"]
		},
		gender: {
			enum: ["male", "female"]
		},
		walls_posted: {
			type: "array",
			items: {
				type: "string"
			}
		},
		walls_liked: {
			type: "array",
			items: {
				type: "string"
			}
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
	cls: "C1" | "C2" | "C3" | "C4" | "C5" | "C6"
	branch: "CSE" | "ECE" | "MECHANICAL" | "CHEMICAL" | "MME" | "CIVIL"
	walls_posted?: string[]
	walls_liked?: string[]
}

export interface IUserCategSchema {
	[batch: string]: {
		[branch: string]: {
			[cls: string]: string[]
		}
	}
}
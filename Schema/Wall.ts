import {IJSONSchema} from 'classui/Components/Form/Schema';

export let WallSchema: IJSONSchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		_id: {
			type: "string"
		},
		postedBy: {
			type: "string"
		},
		postedOn: {
			type: "string",
		},
		content: {
			type: "string",
			maxLength: 10240
		},
		likes: {
			type : "array"
		},
		comments : {
			type : "array"
		}
	},
	required: ["_id", "postedBy", "postedOn", "content", "likes", "comments"]
}

export interface IWallSchema {
	_id: string
	postedBy: string
	postedOn: string
	content: string
	likes: string[]
	comments: any[]
}
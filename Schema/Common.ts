import { IAction } from "App/State/Reducers/RootReducer";
import { IPassiveAction } from "App/PassiveAction";
import { IUserSchema } from "Schema/User";
import { IFileUploadResponse, IFileUpload } from "Schema/FileUpload";

export interface IResponse {
	res_id: number
	error?: string
	data: any
}
export type IResponseData = IAction | string | IPassiveAction | IFileUploadResponse;

export interface IRequest {
	req_id: number
	action: IRequestAction
}

export type IRequestAction = {
	type: "USER_LOGIN"
	_id: string
	password: string
} | {
	type: "USER_REGISTER"
	_id: string
	name: string
	password: string
	gender: "male"|"female"
	batch: IUserSchema["batch"]
	branch: IUserSchema["branch"]
	cls: IUserSchema["cls"]
} | {
	type: "USER_LOGOUT"
} | {
	type: "SEND_MESSAGE"
	userid: string
} | {
	type : "WALL_ADD"
	content: string
} | {
	type: "WALL_DELETE"
	id: string
} | {
	type: "WALL_LIKE"
	id: string
} | IFileUpload
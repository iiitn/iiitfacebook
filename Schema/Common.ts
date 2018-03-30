import { IAction } from "App/State/Reducers/RootReducer";
import { IPassiveAction } from "App/PassiveAction";

export interface IResponse {
	res_id: number
	error?: string
	data: any
}
export type IResponseData = IAction | string | IPassiveAction;

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
} | {
	type: "USER_LOGOUT"
} | {
	type: "SEND_MESSAGE"
	userid: string
}
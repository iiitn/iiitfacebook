export interface IResponse {
	res_id: number
	error?: string
	data: any
}
export interface IRequest {
	req_id: number
	data: IRequestData
}

export type IRequestData = {
	type: "USER_LOGIN"
	_id: string
	password: string
} | {
	type: "USER_REGISTER"
	_id: string
	name: string
	password: string
	gender: "male"|"female"
}
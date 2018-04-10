export interface IFileUpload {
	type: "FILE_UPLOAD"
	id?: string
	totalSize: number
	offset: number
	length: number
	data: Buffer
}
export interface IFileUploadResponse {
	id: string
	done: boolean
}
export const MAX_FILE_SIZE = 1024*1024*100;
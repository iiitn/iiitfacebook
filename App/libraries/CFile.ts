import { Socket } from 'App/Network';
import { IFileUpload, IFileUploadResponse } from 'Schema/FileUpload';
import { MAX_FILE_SIZE } from 'Schema/FileUpload';

// KB per iteration.
const FILE_UPLOAD_CHUNK_SIZE = 10;
export class CFile {
	private _upload: {
		offset: number
	} = {
		offset: 0
	};
	// 250 KB max size.

	private file: File;
	private slice_offset = 0;

	constructor(file: File) {
		this.file = file;
	}
	static getStats(file: File) {
		return {
			name: file.name,
			size: file.size,
			type: file.type
		}
	}
	getStats() {
		return CFile.getStats(this.file);
	}
	getUrl() {
		return new Promise<string>((resolve, reject)=>{
			let reader = new FileReader();
			reader.onload = (event: any)=>{
				let url = event.target.result;
				resolve(url);
			}
			reader.readAsDataURL(this.file);
		});
	}
	resetSliceIndex() {
		this.slice_offset = 0;
	}
	uploadFile(uploadStats?: (data: {id: string, percent: number})=>void) {
		return new Promise(async (resolve, reject)=>{
			let stats = CFile.getStats(this.file);
			if (stats.size>=MAX_FILE_SIZE || stats.size<=0) {
				return reject("Invalid file size. Maybe file size exceeded.");
			}

			this._upload = {
				offset: 0
			};
			let file_id: string|undefined = undefined;
			while (true) {
				try {
					let remainSize = this.file.size - this._upload.offset;
					let chunkSize = FILE_UPLOAD_CHUNK_SIZE*1024;

					let upload_size = (remainSize>chunkSize)?chunkSize:remainSize;
					if (upload_size<=0) {
						return resolve("File Successfully uploaded");
					}
					let slice = await this.getSlice(this._upload.offset, upload_size);

					this._upload.offset += upload_size;
					let response: IFileUploadResponse = await Socket.request({
						type: "FILE_UPLOAD",
						id: file_id,
						offset: this._upload.offset,
						data: slice.buffer,
						length: upload_size,
						totalSize: this.file.size
					}) as any;
					file_id = response.id;
					if (uploadStats) {
						let percent = 100*(this._upload.offset*1.0/this.file.size);
						uploadStats({
							id: file_id,
							percent
						});
					}
				}
				catch(e) {
					reject("Couldn't upload file");
				}
			}
		});
	}
	getSlice(offset: number, size: number) {
		return new Promise<{
			buffer: Buffer
		}>((resolve, reject)=>{
			let slice = this.file.slice(offset, offset+size);
			let fr = new FileReader();
			fr.readAsArrayBuffer(slice);
			fr.onload = (evt)=>{
				let buffer = fr.result;
				resolve({
					buffer
				});
			}
		})
	}
}
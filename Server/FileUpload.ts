import { IFileUploadResponse, IFileUpload, MAX_FILE_SIZE } from "../Schema/FileUpload";
import * as fs from 'fs';
import { v4 } from "uuid";

interface IFile {
	size: number
	uploaded: number
	buffer: Buffer[]
}
interface IFiles {
	[id: string]: IFile
}

export class FileUpload {
	private static files: IFiles = {};
	static handleFileUpload(data: IFileUpload):Promise<IFileUploadResponse> {
		if (data.id) {
			// ID PRESENT. CARRY ON WITH UPLOAD.
			if (this.files[data.id]) {
				// Upload file.
				let file = this.files[data.id];
				if (data.offset!=file.uploaded) {
					// Illegal offset set.
				}
				file.buffer.push(data.data);

				// Update uploaded file size.
				file.uploaded += data.data.length;
				console.log(file.uploaded, file.size);
				if (file.uploaded==file.size) {
					// Done uploading file.
					let fBuffer = Buffer.concat(file.buffer);

					let sharp = 
					fs.write(fs.openSync('./tmp/'+data.id+".png", "w"), fBuffer, (err)=>{
						if (err) {
							console.log("ERROR writing file..");
							return Promise.reject("Couldn't upload file");
						}
						return Promise.resolve({
							id: data.id,
							done: true
						});
					})
				}
				return Promise.resolve({
					id: data.id,
					done: false
				});
			}
			return Promise.reject("Serious Error.");
		}
		if (data.totalSize<=0 || data.totalSize>=MAX_FILE_SIZE) {
			return Promise.reject("Invalid file size provided.");
		}
		let id = v4();
		this.files = {
			...this.files,
			[id]: {
				size: data.totalSize,
				uploaded: data.data.length,
				buffer: [data.data]
			}
		};

		return Promise.resolve({
			id,
			done: false
		});
	}
}
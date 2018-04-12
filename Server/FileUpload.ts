import { IFileUploadResponse, IFileUpload, MAX_FILE_SIZE } from "../Schema/FileUpload";
import * as fs from 'fs';
import { v4 } from "uuid";
import * as Sharp from 'sharp';

interface IFile {
	size: number
	uploaded: number
	buffers: Buffer[]
	doneBuffer?: Buffer
}
interface IFiles {
	[id: string]: IFile
}

export class FileUpload {
	private static files: IFiles = {};
	static async handleFileUpload(data: IFileUpload):Promise<IFileUploadResponse> {
		if (data.id) {
			// ID PRESENT. CARRY ON WITH UPLOAD.
			if (this.files[data.id]) {
				// Upload file.
				let file = this.files[data.id];
				if (data.offset!=file.uploaded) {
					// Illegal offset set.
				}
				file.buffers.push(data.data);

				// Update uploaded file size.
				file.uploaded += data.data.length;
				if (file.uploaded==file.size) {
					// Done uploading file.
					try {
						let tic = process.hrtime();
						let fBuffer = Buffer.concat(file.buffers);
						file.doneBuffer = await Sharp(fBuffer)
						.resize(1000, 1000).max().jpeg({
							quality: 80
						}).toBuffer();
						file.buffers = [];
						let toc = process.hrtime(tic);
						let time = Math.round(toc[0]*1000 + toc[1]/1000000);
						console.log("Time taken : ", data.id, " - ", time/1000.0, "seconds");
					}
					catch(e) {
						console.log("Error : ", e);
						return Promise.reject("Error trying to catch file.");
					}

					// Maybe we should delegate writing to files to later. TODO.
					console.log("Writing files...");
					fs.write(fs.openSync('./tmp/'+data.id+".jpg", "w"), file.doneBuffer, (err)=>{
						if (err) {
							console.log("ERROR writing file..");
							return Promise.reject("Couldn't upload file");
						}
					});
					console.log("File length : ", file.doneBuffer.length);
					return Promise.resolve({
						id: data.id,
						done: {
							size: file.doneBuffer.length
						}
					});
				}
				return Promise.resolve({
					id: data.id
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
				buffers: [data.data]
			}
		};

		return Promise.resolve({
			id
		});
	}
}
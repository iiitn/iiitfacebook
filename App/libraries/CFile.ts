import {Promise} from 'es6-promise';

export class CFile {
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
	getStats() {
		return CFile.getStats(this.file);
	}
	resetSliceIndex() {
		this.slice_offset = 0;
	}
	getNextSlice(size=100) {
		return new Promise<{
			remain_size: number
			buffer: any
		}>((resolve, reject)=>{
			if (this.slice_offset>=this.file.size) {
				return reject("Done With All Slices.");
			}
			let slice = this.file.slice(this.slice_offset, this.slice_offset+size);
			console.log(slice);
			this.slice_offset += size;
			let fr = new FileReader();
			fr.readAsArrayBuffer(slice);
			fr.onload = (evt)=>{
				let buffer = fr.result;
				let remain_size = this.file.size - this.slice_offset;
				if (remain_size<=0) {
					console.log("Sent whole file!!!");
				}
				resolve({
					remain_size,
					buffer
				});
			}
		})
	}
}
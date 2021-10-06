/** @format */

import { FileUpload } from '../interfaces/file-upload.interface';
import path from 'path';
import fs from 'fs';

export default class FileSystem {
	constructor() {}

	public saveTemporalImage(file: FileUpload, userId: string) {
		const path: string = this.createUserFolder(userId);
	}

	private createUserFolder(userId: string): string {
		const pathUser = path.resolve(__dirname, '../uploads', userId);
		const pathUserTemp: string = `${pathUser}/temp`;
		const exists = fs.existsSync(pathUser);

		if (!exists) {
			fs.mkdirSync(pathUser);
			fs.mkdirSync(pathUserTemp);
		}

		return pathUserTemp;
	}
}

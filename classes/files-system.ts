/** @format */

import { FileUpload } from '../interfaces/file-upload.interface';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
	constructor() {}

	public saveTemporalImage(file: FileUpload, userId: string) {
		// Crear carpetas
		const path: string = this.createUserFolder(userId);

		// Nombre archivo
		const fileName: string = this.generateUniqueName(file.name);
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

	private generateUniqueName(originalName: string): string {
		const arrName = originalName.split('.');
		const extension = arrName[arrName.length - 1];
		const uniqueId = uniqid();

		return `${uniqueId}.${extension}`;
	}
}

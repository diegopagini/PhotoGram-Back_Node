/** @format */

import { FileUpload } from '../interfaces/file-upload.interface';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
	constructor() {}

	public saveTemporalImage(file: FileUpload, userId: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			// Crear carpetas
			const path: string = this.createUserFolder(userId);

			// Nombre archivo
			const fileName: string = this.generateUniqueName(file.name);

			// Mover el archivo del temporal a nuestra carpeta
			file.mv(`${path}/${fileName}`, (err: any) => {
				if (err) {
					// No se pudo mover
					reject(err);
				} else {
					// Todo salio bien
					resolve();
				}
			});
		});
	}

	public moveImagesFromTempToPost(userId: string): string[] {
		const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
		const pathPosts = path.resolve(__dirname, '../uploads', userId, 'posts');

		if (!fs.existsSync(pathTemp)) {
			return [];
		}

		if (!fs.existsSync(pathPosts)) {
			fs.mkdirSync(pathPosts);
		}

		const imagesTemp = this.getImagesFromTemp(userId);
		imagesTemp.forEach((img: string) => {
			fs.renameSync(`${pathTemp}/${img}`, `${pathPosts}/${img}`);
		});

		return imagesTemp;
	}

	private getImagesFromTemp(userId: string) {
		const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
		return fs.readdirSync(pathTemp) || [];
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

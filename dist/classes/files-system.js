"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    saveTemporalImage(file, userId) {
        return new Promise((resolve, reject) => {
            // Crear carpetas
            const path = this.createUserFolder(userId);
            // Nombre archivo
            const fileName = this.generateUniqueName(file.name);
            // Mover el archivo del temporal a nuestra carpeta
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    // No se pudo mover
                    reject(err);
                }
                else {
                    // Todo salio bien
                    resolve();
                }
            });
        });
    }
    moveImagesFromTempToPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        const pathPosts = path_1.default.resolve(__dirname, '../uploads', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPosts)) {
            fs_1.default.mkdirSync(pathPosts);
        }
        const imagesTemp = this.getImagesFromTemp(userId);
        imagesTemp.forEach((img) => {
            fs_1.default.renameSync(`${pathTemp}/${img}`, `${pathPosts}/${img}`);
        });
        return imagesTemp;
    }
    getPhotoByUrl(userId, img) {
        const pathPhoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        const exists = fs_1.default.existsSync(pathPhoto);
        if (!exists) {
            return path_1.default.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathPhoto;
    }
    getImagesFromTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    createUserFolder(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = `${pathUser}/temp`;
        const exists = fs_1.default.existsSync(pathUser);
        if (!exists) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    generateUniqueName(originalName) {
        const arrName = originalName.split('.');
        const extension = arrName[arrName.length - 1];
        const uniqueId = (0, uniqid_1.default)();
        return `${uniqueId}.${extension}`;
    }
}
exports.default = FileSystem;

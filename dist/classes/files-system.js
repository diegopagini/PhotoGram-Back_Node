"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class FileSystem {
    constructor() { }
    saveTemporalImage(file, userId) {
        // Crear carpetas
        const path = this.createUserFolder(userId);
        // Nombre archivo
        const fileName = '';
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
    }
}
exports.default = FileSystem;

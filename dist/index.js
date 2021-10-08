"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const user_1 = __importDefault(require("./routes/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_1 = __importDefault(require("./routes/post"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FileUpload
server.app.use((0, express_fileupload_1.default)({ useTempFiles: true }));
// Cors
server.app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
// Rutas de la app
server.app.use('/user', user_1.default);
server.app.use('/posts', post_1.default);
// Conectar DB
mongoose_1.default.connect('mongodb://localhost:27017/photosgram', {}, (err) => {
    if (err)
        throw err;
    console.log('Base de datos Online');
});
// Levantar Express
server.start(() => {
    console.log(`Servidor corriendo en puerto: ${server.port}`);
});

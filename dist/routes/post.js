"use strict";
/** @format */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const post_model_1 = require("../models/post.model");
const files_system_1 = __importDefault(require("../classes/files-system"));
const postRoutes = (0, express_1.Router)();
const fileSystem = new files_system_1.default();
// Crear post
postRoutes.post('/', [auth_1.checkToken], (req, resp) => {
    const body = req.body;
    body.user = req.user._id;
    post_model_1.Post.create(body)
        .then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate('user').execPopulate();
        resp.json({
            ok: true,
            post: postDB,
        });
    }))
        .catch((err) => {
        resp.json(err);
    });
});
// Obtener posts paginados
postRoutes.get('/', [auth_1.checkToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();
    resp.json({
        ok: true,
        page,
        posts,
    });
}));
// Servicio para subir archivos
postRoutes.post('/upload', [auth_1.checkToken], (req, resp) => {
    if (!req.files) {
        return resp.status(400).json({
            ok: false,
            message: 'No se subió ningun archivo',
        });
    }
    const file = req.files.image;
    if (!file) {
        return resp.status(400).json({
            ok: false,
            message: 'No se subió ningun archivo - imagen',
        });
    }
    if (!file.mimetype.includes('image')) {
        return resp.status(400).json({
            ok: false,
            message: 'No se subió una imagen',
        });
    }
    fileSystem.saveTemporalImage(file, req.user._id);
    resp.json({
        ok: true,
        file: file.mimetype,
    });
});
exports.default = postRoutes;

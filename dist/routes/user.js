"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRoutes = (0, express_1.Router)();
// Crear usuario
userRoutes.post('/create', (req, resp) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
    };
    user_model_1.User.create(user)
        .then((userDB) => {
        resp.json({
            ok: true,
            userDB,
        });
    })
        .catch((err) => {
        resp.json({
            ok: false,
            err,
        });
    });
});
// Login
userRoutes.post('/login', (req, resp) => {
    const body = req.body;
    user_model_1.User.findOne({
        email: body.email,
    }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return resp.json({
                ok: false,
                message: 'Usuario/Contraseña no son correctas',
            });
        }
        if (userDB.comparePassword(body.password)) {
            return resp.json({
                ok: true,
                token: 'asdasd12315ajsdi',
            });
        }
        else {
            return resp.json({
                ok: false,
                message: 'Usuario/Contraseña no son correctas ***',
            });
        }
    });
});
exports.default = userRoutes;

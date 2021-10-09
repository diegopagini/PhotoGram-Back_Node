"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const auth_1 = require("../middlewares/auth");
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
        const userToken = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar,
        });
        return resp.json({
            ok: true,
            token: userToken,
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
            const userToken = token_1.default.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar,
            });
            return resp.json({
                ok: true,
                token: userToken,
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
// Actualizar usuario
userRoutes.post('/update', auth_1.checkToken, (req, res) => {
    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        avatar: req.body.avatar || req.user.avatar,
    };
    user_model_1.User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar,
        });
        res.json({
            ok: true,
            token: tokenUser,
        });
    });
});
userRoutes.get('/', [auth_1.checkToken], (req, resp) => {
    const user = req.user;
    resp.json({
        ok: true,
        user,
    });
});
exports.default = userRoutes;

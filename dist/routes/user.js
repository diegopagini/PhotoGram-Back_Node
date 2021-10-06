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
exports.default = userRoutes;

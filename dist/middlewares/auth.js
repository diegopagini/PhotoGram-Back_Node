"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const token_1 = __importDefault(require("../classes/token"));
const checkToken = (req, resp, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.checkToken(userToken)
        .then((decoded) => {
        req.user = decoded.user;
        next();
    })
        .catch((err) => {
        resp.json({
            ok: false,
            message: 'Token incorrecto',
        });
    });
};
exports.checkToken = checkToken;

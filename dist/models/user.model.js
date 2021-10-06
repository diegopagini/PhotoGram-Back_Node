"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
    },
    avatar: {
        type: String,
        default: 'av-1.png',
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
    },
});
exports.User = (0, mongoose_1.model)('User', userSchema);

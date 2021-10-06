"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    created: {
        type: Date,
    },
    message: {
        type: String,
    },
    img: [
        {
            type: String,
        },
    ],
    coords: {
        type: String,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe de existir una referencia a un usuario'],
    },
});
postSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});

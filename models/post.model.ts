/** @format */

import { Schema, Document, model } from 'mongoose';

const postSchema = new Schema({
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
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Debe de existir una referencia a un usuario'],
	},
});

postSchema.pre<Ipost>('save', function (next) {
	this.created = new Date();
	next();
});

export interface Ipost extends Document {
	created: Date;
	message: string;
	img: string[];
	coords: string;
	user: string;
}

export const Post = model<Ipost>('Post', postSchema);

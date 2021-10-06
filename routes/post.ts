/** @format */

import { Response, Router } from 'express';
import { checkToken } from '../middlewares/auth';
import { Post } from '../models/post.model';

const postRoutes = Router();

// Crear post
postRoutes.post('/', [checkToken], (req: any, resp: Response) => {
	const body = req.body;
	body.user = req.user._id;

	Post.create(body)
		.then(async (postDB: any) => {
			await postDB.populate('user').execPopulate();

			resp.json({
				ok: true,
				post: postDB,
			});
		})
		.catch((err) => {
			resp.json(err);
		});
});

// Obtener posts paginados
postRoutes.get('/', [checkToken], async (req: any, resp: Response) => {
	let page: number = Number(req.query.page) || 1;
	let skip = page - 1;
	skip = skip * 10;

	const posts = await Post.find()
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
});

export default postRoutes;

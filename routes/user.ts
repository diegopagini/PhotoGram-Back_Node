/** @format */

import { Request, Response, Router } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

const userRoutes = Router();

userRoutes.post('/create', (req: Request, resp: Response) => {
	const user = {
		name: req.body.name,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10),
		avatar: req.body.avatar,
	};

	User.create(user)
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

export default userRoutes;

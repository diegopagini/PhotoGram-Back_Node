/** @format */

import { Request, Response, Router } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

const userRoutes = Router();

// Crear usuario
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

// Login
userRoutes.post('/login', (req: Request, resp: Response) => {
	const body = req.body;
	User.findOne(
		{
			email: body.email,
		},
		(err: Error, userDB: any) => {
			if (err) throw err;
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
			} else {
				return resp.json({
					ok: false,
					message: 'Usuario/Contraseña no son correctas ***',
				});
			}
		}
	);
});

export default userRoutes;

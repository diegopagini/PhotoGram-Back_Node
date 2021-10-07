/** @format */

import { Request, Response, Router } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { checkToken } from '../middlewares/auth';

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
			const userToken = Token.getJwtToken({
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
				const userToken = Token.getJwtToken({
					_id: userDB._id,
					name: userDB.name,
					email: userDB.email,
					avatar: userDB.avatar,
				});

				return resp.json({
					ok: true,
					token: userToken,
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

// Actualizar usuario
userRoutes.post('/update', [checkToken], (req: any, resp: Response) => {
	const user = {
		name: req.body.name || req.user.name,
		email: req.body.email || req.user.email,
		avatar: req.body.avatar || req.user.avatar,
	};

	User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
		if (err) throw err;

		if (!userDB) {
			return resp.json({
				ok: false,
				message: 'No existe un usuario con ese ID',
			});
		}

		const userToken = Token.getJwtToken({
			_id: userDB._id,
			name: userDB.name,
			email: userDB.email,
			avatar: userDB.avatar,
		});

		return resp.json({
			ok: true,
			token: userToken,
		});
	});

	resp.json({
		ok: true,
		user: req.user,
	});
});

userRoutes.get('/', [checkToken], (req: any, resp: Response) => {
	const user = req.user;

	resp.json({
		ok: true,
		user,
	});
});

export default userRoutes;

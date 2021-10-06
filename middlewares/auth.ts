/** @format */

import { Response, Request, NextFunction } from 'express';
import Token from '../classes/token';

export const checkToken = (req: any, resp: Response, next: NextFunction) => {
	const userToken = req.get('x-token') || '';

	Token.checkToken(userToken)
		.then((decoded: any) => {
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

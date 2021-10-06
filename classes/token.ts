/** @format */
import jwt from 'jsonwebtoken';

export default class Token {
	private static seed: string = 'este-es-el-seed-de-mi-app-secreto';
	private static tokenExpiration: string = '30d';

	constructor() {}

	static getJwtToken(payload: any): string {
		return jwt.sign(
			{
				user: payload,
			},
			this.seed,
			{ expiresIn: this.tokenExpiration }
		);
	}

	static checkToken(userToken: string) {
		return new Promise((resolve, reject) => {
			jwt.verify(userToken, this.seed, (err, decoded) => {
				if (err) {
					reject();
				} else {
					resolve(decoded);
				}
			});
		});
	}
}

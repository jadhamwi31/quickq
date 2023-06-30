import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../models/error.model";
import { IUserTokenPayload } from "../ts/interfaces/user.interfaces";

const generate = (payload: Partial<IUserTokenPayload>) => {
	const PRIVATE_KEY = process.env.PRIVATE_KEY;

	const token = jwt.sign(JSON.stringify(payload), PRIVATE_KEY);

	return token;
};

const validate = async (token: string): Promise<IUserTokenPayload> => {
	return new Promise((resolve, reject) => {
		const PRIVATE_KEY = process.env.PRIVATE_KEY;

		jwt.verify(token, PRIVATE_KEY, (err: any, user: any) => {
			if (err)
				reject(
					new UnauthorizedError(`jwt token failed to verify ${err.message}`)
				);
			resolve(user);
		});
	});
};

export const JwtService = {
	generate,
	validate,
};

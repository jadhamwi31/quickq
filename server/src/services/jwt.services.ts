import { UnauthorizedError } from "../models/error.model";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

const generate = (user: User) => {
	const PRIVATE_KEY = process.env.PRIVATE_KEY;

	const token = jwt.sign(
		JSON.stringify({ username: user.username, role: user.role }),
		PRIVATE_KEY
	);

	return token;
};

const decode = async (token: string): Promise<User> => {
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
	decode,
};

import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

const generateJwt = (user: User) => {
	const PRIVATE_KEY = process.env.PRIVATE_KEY;

	const token = jwt.sign(
		JSON.stringify({ username: user.username, role: user.role }),
		PRIVATE_KEY
	);

	return token;
};

export const JwtService = {
	generateJwt,
};

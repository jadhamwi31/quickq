import { AppDataSource } from "../models";
import { UnauthorizedError } from "../models/error.model";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { JwtService } from "./jwt.services";

const login = async (username: string, password: string) => {
	const user = await AppDataSource.getRepository(User).findOneBy({ username });
	if (user) {
		if (user.password === password) {
			const token = JwtService.generateJwt(user);
			return token;
		} else {
			throw new UnauthorizedError("incorrect password");
		}
	} else {
		throw new UnauthorizedError("incorrect username");
	}
};

export const AuthService = {
	login,
};

import { NextFunction, Request, Response } from "express";
import { CustomError, MissingPropertiesError } from "../models/error.model";
import { User } from "../models/user.model";

const validateLogin = (
	req: Request<any, any, Partial<Pick<User, "username" | "password">>>,
	_: Response,
	next: NextFunction
) => {
	const { username, password } = req.body;
	if (!username) {
		return next(new MissingPropertiesError("username is required"));
	}
	if (!password) {
		return next(new MissingPropertiesError("password is required"));
	}
	return next();
};

export const AuthValidators = {
	validateLogin,
};

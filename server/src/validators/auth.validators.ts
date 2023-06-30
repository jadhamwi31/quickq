import { NextFunction, Request, Response } from "express";
import { CustomError, BadRequestError } from "../models/error.model";
import { User } from "../models/user.model";
import { IUserCredentials } from "../ts/interfaces/user.interfaces";

const validateLogin = (
	req: Request<any, any, Partial<IUserCredentials>>,
	_: Response,
	next: NextFunction
) => {
	const { username, password, table_code } = req.body;
	if (table_code) {
		return next();
	}
	if (!username) {
		return next(new BadRequestError("username is required"));
	}
	if (!password) {
		return next(new BadRequestError("password is required"));
	}
	return next();
};

export const AuthValidators = {
	validateLogin,
};

import { NextFunction, Request, Response } from "express";
import { UserCredentialsType } from "../ts/types/user.types";
import { CustomError, MissingPropertiesError } from "../models/error.model";

const validateLogin = (
	req: Request<any, any, Partial<UserCredentialsType>>,
	res: Response,
	next: NextFunction
) => {
	const { username, password } = req.body;
	if (!username) {
		next(new MissingPropertiesError("username is required"));
	}
	if (!password) {
		next(new MissingPropertiesError("password is required"));
	}
	next();
};

export const AuthValidators = {
	validateLogin,
};

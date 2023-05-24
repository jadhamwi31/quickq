import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model";
import { IAccessCode } from "../ts/interfaces/client.interfaces";
import { IUserCredentials } from "../ts/interfaces/user.interfaces";

const loginHandler = async (
	req: Request<any, any, Partial<IUserCredentials>>,
	res: Response,
	next: NextFunction
) => {
	const { username, password, table_code } = req.body;
	try {
		if (username && password) {
			const jwt = await AuthService.loginByUsernameAndPassword(
				username,
				password
			);
			return res
				.status(StatusCodes.OK)
				.cookie("jwt", jwt, { httpOnly: true })
				.send({ code: StatusCodes.OK, message: "logged in" });
		}
		if (table_code) {
			const jwt = await AuthService.loginByTableCode(table_code);
			return res
				.status(StatusCodes.OK)
				.cookie("jwt", jwt, { httpOnly: true })
				.send({ code: StatusCodes.OK, message: "logged in" });
		}
	} catch (e) {
		next(e);
	}
};

export const UserController = {
	loginHandler,
};

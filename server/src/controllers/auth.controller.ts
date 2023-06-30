import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model";
import { IAccessCode } from "../ts/interfaces/client.interfaces";
import { IUserCredentials } from "../ts/interfaces/user.interfaces";
import { OK } from "zod";

const loginHandler = async (
	req: Request<any, any, Partial<IUserCredentials>>,
	res: Response,
	next: NextFunction
) => {
	const { username, password, table_code } = req.body;
	try {
		if (username && password) {
			const {token,role} = await AuthService.loginByUsernameAndPassword(
				username,
				password
			);
			return res
				.status(StatusCodes.OK)
				.cookie("jwt", token, { httpOnly: false })
				.send({ code: StatusCodes.OK, message: "logged in", token,username,role });
		}
		if (table_code) {
			const {token,role,tableId} = await AuthService.loginByTableCode(table_code);
			return res
				.status(StatusCodes.OK)
				.cookie("jwt", token, { httpOnly: false })
				.send({ code: StatusCodes.OK, message: "logged in", token,role,tableId});
		}
	} catch (e) {
		next(e);
	}
};

const logoutHandler = async (
	req: Request<any, any, Partial<IUserCredentials>>,
	res: Response,
	next: NextFunction
) => {
	return res
		.status(StatusCodes.OK)
		.clearCookie("jwt")
		.send({ code: StatusCodes.OK, message: "logged out" });
};

export const UserController = {
	loginHandler,
	logoutHandler,
};

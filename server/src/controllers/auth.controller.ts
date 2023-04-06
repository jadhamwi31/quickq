import { NextFunction, Request, Response } from "express";
import { UserCredentialsType } from "../ts/types/user.types";
import { AuthService } from "../services/auth.service";
import { StatusCodes } from "http-status-codes";

const login = async (
	req: Request<any, any, UserCredentialsType>,
	res: Response,
	next: NextFunction
) => {
	const { username, password } = req.body;
	try {
		const jwt = await AuthService.login(username, password);

		return res
			.status(200)
			.cookie("jwt", jwt)
			.send({ code: StatusCodes.OK, message: "logged in successfully" });
	} catch (e) {
		next(e);
	}
};

export const UserController = {
	login,
};

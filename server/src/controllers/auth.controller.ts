import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model";

const loginHandler = async (
	req: Request<any, any, Pick<User, "username" | "password">>,
	res: Response,
	next: NextFunction
) => {
	const { username, password } = req.body;
	try {
		const jwt = await AuthService.login(username, password);

		return res
			.status(StatusCodes.OK)
			.cookie("jwt", jwt)
			.send({ code: StatusCodes.OK, message: "logged in successfully" });
	} catch (e) {
		next(e);
	}
};

export const UserController = {
	loginHandler,
};

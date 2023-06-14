import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { UsersService } from "../services/users.service";
import { StatusCodes } from "http-status-codes";

const createNewUserHandler = async (
	req: Request<{}, {}, User>,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.body;
		await UsersService.createNewUser(user);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "user created successfully" });
	} catch (e) {
		return next(e);
	}
};
const deleteUserHandler = async (
	req: Request<{ username: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { username } = req.params;
		await UsersService.deleteUser(username);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "user deleted successfully" });
	} catch (e) {
		return next(e);
	}
};

const getUsersHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await UsersService.getUsers();
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, data: users });
	} catch (e) {
		return next(e);
	}
};

const updateUserHandler = async (
	req: Request<
		{ username: string },
		{},
		Partial<
			Pick<User, "username" | "password" | "role"> & { oldPassword: string }
		>
	>,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.body;
		const { username } = req.params;
		const usernameToUpdate = username ?? req.user.username;
		await UsersService.updateUser(usernameToUpdate, user);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "user updated successfully" });
	} catch (e) {
		return next(e);
	}
};

export const UsersController = {
	createNewUserHandler,
	deleteUserHandler,
	getUsersHandler,
	updateUserHandler,
};

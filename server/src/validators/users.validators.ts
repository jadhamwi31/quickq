import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import {
	BadRequestError,
	ForbiddenError,
	UnauthorizedError,
} from "../models/error.model";
import { UserRoleType } from "../ts/types/user.types";

const validateCreateNewUser = (
	req: Request<{}, {}, Partial<User>>,
	res: Response,
	next: NextFunction
) => {
	const { username, password, role } = req.body;

	if (!username) {
		return next(new BadRequestError("username is missing"));
	}
	if (!password) {
		return next(new BadRequestError("password is missing"));
	}
	if (!role) {
		return next(new BadRequestError("role is missing"));
	}

	if (["chef", "cashier","manager"].indexOf(role) < 0) {
		return next(new BadRequestError("invalid role"));
	}
	return next();
};

const validateDeleteUser = (
	req: Request<Partial<{ username: string }>>,
	res: Response,
	next: NextFunction
) => {
	const { username } = req.body;
	const { username: _username } = req.user;
	if (!username) {
		return next(new BadRequestError("username is missing"));
	}
	if (_username === username) {
		return next(new ForbiddenError("you can't delete your account"));
	}
	return next();
};

const validateUpdateUser = (
	req: Request<
		Partial<{ username: string }>,
		{},
		Partial<
			Pick<User, "username" | "password" | "role"> & { oldPassword: string }
		>
	>,
	res: Response,
	next: NextFunction
) => {
	const { username, password, role, oldPassword } = req.body;
	const { username: _username } = req.params;
	const user = req.user;

	if (user.role !== "manager") {
		if (_username) {
			return next(new ForbiddenError("you can't pass username as parameter"));
		}
		if (username) {
			return next(new ForbiddenError("you can't update username"));
		}
		if (role) {
			return next(new ForbiddenError("you can't change roles"));
		}
		if (password && !oldPassword) {
			return next(new BadRequestError("you have to provide old password"));
		}
	} else {
		if (!_username && role) {
			return next(new BadRequestError("you can't change your role as manager"));
		}
	}
	return next();
};

export const UsersValidators = {
	validateCreateNewUser,
	validateDeleteUser,
	validateUpdateUser,
};

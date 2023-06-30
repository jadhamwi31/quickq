import { AppDataSource } from "../models";
import {
	ConflictError,
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "../models/error.model";
import { User } from "../models/user.model";
import { UserRoleType } from "../ts/types/user.types";
import requestContext from "express-http-context";

const createNewUser = async (user: User) => {
	const usersRepo = AppDataSource.getRepository(User);
	const userRecord = await usersRepo.findOneBy({ username: user.username });

	if (userRecord) {
		throw new ConflictError("user already exists");
	}
	await usersRepo.save(user);
};

const deleteUser = async (username: string) => {
	const usersRepo = AppDataSource.getRepository(User);
	const userRecord = await usersRepo.findOneBy({ username });

	if (!userRecord) {
		throw new NotFoundError("user doesn't exist");
	}
	await usersRepo.remove(userRecord);
};

const getUsers = async () => {
	const usersRepo = AppDataSource.getRepository(User);
	const usersRecords = await usersRepo.find();

	if (!usersRecords) {
		throw new NotFoundError("user doesn't exist");
	}
	return usersRecords;
};

const updateUser = async (
	_username: string,
	{
		username,
		password,
		role,
		oldPassword,
	}: Partial<
		Pick<User, "username" | "password" | "role"> & {
			oldPassword: string;
		}
	>
) => {
	const usersRepo = AppDataSource.getRepository(User);
	const userRecord = await usersRepo.findOneBy({ username: _username });

	const userRequestedRole = requestContext.get("role");

	if (!userRecord) {
		throw new NotFoundError("user with this username was not found");
	}

	if (username) {
		userRecord.username = username;
	}
	if (password) {
		if (userRequestedRole !== "manager") {
			if (oldPassword === userRecord.password) {
				userRecord.password = password;
			} else {
				throw new ForbiddenError("incorrect old password");
			}
		} else {
			userRecord.password = password;
		}
	}
	if (role) {
		userRecord.role = role;
	}
	await usersRepo.update({ username: _username }, userRecord);
};

export const UsersService = {
	createNewUser,
	deleteUser,
	getUsers,
	updateUser,
};

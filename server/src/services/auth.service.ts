import { AppDataSource } from "../models";
import { UnauthorizedError } from "../models/error.model";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { JwtService } from "./jwt.service";
import { TableCode } from "../models/table.model";

const loginByUsernameAndPassword = async (
	username: string,
	password: string
) => {
	const user = await AppDataSource.getRepository(User).findOneBy({ username });
	if (user) {
		if (user.password === password) {
			const token = JwtService.generate({
				username: user.username,
				role: user.role,
			});
			return token;
		} else {
			throw new UnauthorizedError("incorrect password");
		}
	} else {
		throw new UnauthorizedError("incorrect username");
	}
};

const loginByTableCode = async (code: string) => {
	// get table id from redis using access code
	const tableCodeRecord = await AppDataSource.getRepository(TableCode).findOne({
		where: { code },
		relations: { table: true },
	});

	if (!tableCodeRecord) {
		throw new Error("invalid table code");
	}

	// create token for client
	const token = JwtService.generate({
		role: "client",
		tableId: tableCodeRecord.table.id,
	});

	return token;
};

export const AuthService = {
	loginByUsernameAndPassword,
	loginByTableCode,
};

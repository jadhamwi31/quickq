import { AppDataSource } from "../models";
import { UnauthorizedError } from "../models/error.model";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { JwtService } from "./jwt.service";
import { Table, TableCode, TableSession } from "../models/table.model";
import { uniqueId } from "lodash";
import { v4 as uuid } from "uuid";
import RedisService from "./redis.service";
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
			return {token,role:user.role};
		} else {
			throw new UnauthorizedError("incorrect password");
		}
	} else {
		throw new UnauthorizedError("incorrect username");
	}
};

const loginByTableCode = async (code: string) => {
	const tableCodeRecord = await AppDataSource.getRepository(TableCode).findOne({
		where: { code },
		relations: { table: true },
	});

	const tablesSessionsRepo = AppDataSource.getRepository(TableSession);

	if (!tableCodeRecord) {
		throw new Error("invalid table code");
	}

	const clientId = uuid();

	const tableSession = await tablesSessionsRepo.findOneBy({
		table: tableCodeRecord.table,
	});
	tableSession.clientId = clientId;
	await tablesSessionsRepo.save(tableSession);

	const token = JwtService.generate({
		role: "client",
		tableId: tableCodeRecord.table.id,
		clientId,
	});

	await RedisService.redis.hset(
		`tables:sessions`,
		String(tableCodeRecord.table.id),
		clientId
	);
	console.log(tableCodeRecord.table.id)
	return {token,role:"client",tableId:tableCodeRecord.table.id};
};

export const AuthService = {
	loginByUsernameAndPassword,
	loginByTableCode,
};

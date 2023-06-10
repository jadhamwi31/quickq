import { NextFunction, Request, Response } from "express";
import { UserRoleType } from "../ts/types/user.types";
import { JwtService } from "../services/jwt.service";
import { ForbiddenError, UnauthorizedError } from "../models/error.model";
import * as _ from "lodash";
import RedisService from "../services/redis.service";
import { AppDataSource } from "../models";
import { TableSession } from "../models/table.model";
import { TablesService } from "../services/tables.service";
import { IUserTokenPayload } from "../ts/interfaces/user.interfaces";
import requestContext from "express-http-context";

const authorizeClient = async (user: IUserTokenPayload) => {
	const clientId = await TablesService.getTableSessionClientId(user.tableId);

	if (clientId != user.clientId) {
		throw new ForbiddenError("you're not on this table");
	}
};

export const authFor = (roles: UserRoleType[]) => {
	return async (req: Request<any>, res: Response<any>, next: NextFunction) => {
		const { jwt: token }: { jwt: string } = req.cookies;

		try {
			const user = await JwtService.validate(token);

			if (_.find(roles, (current) => current === user.role)) {
				if (user.role === "client") {
					if (req.originalUrl !== "/tables/session") {
						authorizeClient(user);
					}
					requestContext.set("tableId", user.tableId);
				} else {
					requestContext.set("username", user.username);
				}
				req.user = user;

				return next();
			} else {
				throw new ForbiddenError(`forbidden to access as ${user.role}`);
			}
		} catch (e) {
			return next(e);
		}
	};
};

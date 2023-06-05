import { NextFunction, Request, Response } from "express";
import { UserRoleType } from "../ts/types/user.types";
import { JwtService } from "../services/jwt.service";
import { ForbiddenError, UnauthorizedError } from "../models/error.model";
import * as _ from "lodash";
import RedisService from "../services/redis.service";
import { AppDataSource } from "../models";
import { TableSession } from "../models/table.model";
import { TablesService } from "../services/tables.service";

export const authFor = (roles: UserRoleType[]) => {
	return async (req: Request<any>, res: Response<any>, next: NextFunction) => {
		const { jwt: token }: { jwt: string } = req.cookies;

		try {
			const user = await JwtService.validate(token);

			if (_.find(roles, (current) => current === user.role)) {
				if (user.role === "client") {
					const clientId = await TablesService.getTableSessionClientId(
						user.tableId
					);
					if (clientId != req.user.clientId) {
						throw new ForbiddenError("you're not on this table");
					}
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

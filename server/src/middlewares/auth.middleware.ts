import { NextFunction, Request, Response } from "express";
import { UserRoleType } from "../ts/types/user.types";
import { JwtService } from "../services/jwt.service";
import { ForbiddenError, UnauthorizedError } from "../models/error.model";
import * as _ from "lodash";
import RedisService from "../services/redis.service";

export const authFor = (roles: UserRoleType[]) => {
	return async (req: Request<any>, res: Response<any>, next: NextFunction) => {
		const { jwt: token }: { jwt: string } = req.cookies;

		try {
			const user = await JwtService.decode(token);

			if (_.find(roles, (current) => current === user.role)) {
				if (user.role === "client") {
					const tableClientId = await RedisService.redis.hget(
						"tables:sessions",
						String(user.tableId)
					);

					if (tableClientId !== user.clientId) {
						throw new ForbiddenError(
							"unauthorized to access resources after your session has ended"
						);
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

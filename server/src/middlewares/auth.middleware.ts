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
import authorization from "auth-header"

const authorizeClient = async (user: IUserTokenPayload) => {
	const clientId = await TablesService.getTableSessionClientId(user.tableId);

	if (clientId != user.clientId) {
		throw new ForbiddenError("you're not on this table");
	}
};


export const authFor = (roles: UserRoleType[]) => {
	return async (req: Request<any,any,any,any>, res: Response<any>, next: NextFunction) => {
		
		try {
			const authorizationHeader = req.headers["authorization"];
			if(typeof authorizationHeader === "undefined"){
				throw new UnauthorizedError("unauthorized : authorization header not found")
			}
			const token = authorizationHeader.split(" ")[1];
			const user = await JwtService.validate(token);

			if (_.find(roles, (current) => current === user.role)) {
				if (user.role === "client") {
					if (req.originalUrl !== "/tables/session") {
						await authorizeClient(user);
					}
					requestContext.set("tableId", String(user.tableId));
				} else {
					requestContext.set("username", user.username);
				}
				requestContext.set("role", user.role);
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

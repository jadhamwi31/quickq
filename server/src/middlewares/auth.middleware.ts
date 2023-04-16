import { NextFunction, Request, Response } from "express";
import { UserRoleType } from "../ts/types/user.types";
import { JwtService } from "../services/jwt.service";
import { ForbiddenError, UnauthorizedError } from "../models/error.model";
import * as _ from "lodash";

export const authFor = (roles: UserRoleType[]) => {
	return async (req: Request<any>, res: Response<any>, next: NextFunction) => {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];

		if (token == null) return next(new UnauthorizedError("invalid token"));

		try {
			const user = await JwtService.decode(token);

			if (_.find(roles, (current) => current === user.role)) {
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

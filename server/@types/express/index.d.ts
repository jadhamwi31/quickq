import { User } from "../../src/models/user.model";
import * as express from "express";
import { UserRoleType } from "../../src/ts/types/user.types";
import { IUserTokenPayload } from "../../src/ts/interfaces/user.interfaces";

export {};

declare global {
	namespace Express {
		interface Request {
			user: IUserTokenPayload;
		}
	}
}

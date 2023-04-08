import { User } from "../../src/models/user.model";
import * as express from "express";
import { UserRoleType } from "../../src/ts/types/user.types";

export {};

declare global {
	namespace Express {
		interface Request {
			user: User;
		}
	}
}

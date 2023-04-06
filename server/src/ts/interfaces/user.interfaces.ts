import { UserRoleType } from "../types/user.types";

export interface IUser {
	username: string;
	password: string;
	role: UserRoleType;
}

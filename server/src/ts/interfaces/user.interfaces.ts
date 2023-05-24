import { UserRoleType } from "../types/user.types";

export interface IUserCredentials {
	username: string;
	password: string;
	table_code: string;
}

export interface IUserTokenPayload {
	username?: string;
	tableId?: number;
	clientId?: string;
	role: UserRoleType;
}

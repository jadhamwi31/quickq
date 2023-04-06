import { IUser } from "../interfaces/user.interfaces";

export type UserRoleType = "manager" | "cashier" | "chef";

export type UserCredentialsType = Omit<IUser, "role">;

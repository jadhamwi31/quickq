import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserRoleType } from "../ts/types/user.types";

@Entity()
export class User {
	@PrimaryColumn()
	username: string;

	@Column()
	password: string;

	@Column()
	role: UserRoleType;
}

import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Brand {
	@PrimaryColumn()
	name: string;

	@Column({ nullable: true })
	slogan?: string;

	@Column({ nullable: true })
	logo?: string;
}

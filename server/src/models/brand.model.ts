import { Column, Entity } from "typeorm";

@Entity()
export class Brand {
	@Column()
	name: string;

	@Column({ nullable: true })
	slogan?: string;

	@Column({ nullable: true })
	logo?: string;
}

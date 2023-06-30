import {Column, Entity, PrimaryColumn,} from "typeorm";

@Entity()
export class MenuCustomization {
	@PrimaryColumn()
	name: string;

	@Column()
	styles: string;

	@Column()
	active: boolean;

}

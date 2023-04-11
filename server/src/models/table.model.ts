import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from "typeorm";
import { TableStatus } from "../ts/types/table.types";

@Entity()
export class Table {
	@PrimaryColumn()
	id: number;
	@Column()
	status: TableStatus;
}

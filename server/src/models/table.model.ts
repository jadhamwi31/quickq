import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from "typeorm";
import { TableStatus } from "../ts/types/table.types";
import { Order } from "./order.model";

@Entity()
export class Table {
	@PrimaryColumn()
	id: number;
	@Column()
	status: TableStatus;

	@OneToMany(() => Order, (order) => order.table)
	orders: Order[];
}

@Entity()
export class TableCode {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	code: string;

	@OneToOne(() => Table, { onDelete: "CASCADE" })
	@JoinColumn()
	table: Table;
}

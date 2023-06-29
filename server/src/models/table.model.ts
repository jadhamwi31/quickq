import {
	Column, DeleteDateColumn,
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
import {Payment} from "./payment.model";

@Entity()
export class Table {
	@PrimaryColumn()
	id: number;
	@Column()
	status: TableStatus;

	@OneToMany(() => Payment, (payment) => payment.table)
	payments: Payment[];

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

@Entity()
export class TableSession {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Table,{onDelete:"CASCADE"})
	@JoinColumn()
	table: Table;

	@Column({ nullable: true })
	clientId: string;
}

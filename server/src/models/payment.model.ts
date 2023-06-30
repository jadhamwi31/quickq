import {
	Column,
	Entity, ManyToOne,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./order.model";
import {Table} from "./table.model";

@Entity()
export class Payment {
	@PrimaryGeneratedColumn()
	id: string;

	@PrimaryColumn()
	clientId: string;

	@Column({ type: "timestamptz", nullable: true })
	date: Date;

	@Column({ nullable: true })
	amount: number;



	@OneToMany(() => Order, (order) => order.payment)
	orders: Order[];

	@ManyToOne(() => Table, (table) => table.payments,{onDelete:"CASCADE"})
	table: Table;
}

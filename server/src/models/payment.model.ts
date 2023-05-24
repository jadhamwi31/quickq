import {
	Column,
	Entity,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./order.model";

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
}

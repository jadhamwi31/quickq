import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { UserRoleType } from "../ts/types/user.types";
import { DishIngredient, OrderDish } from "./shared.model";
import { OrderStatusType } from "../ts/types/order.types";
import { Table } from "./table.model";
import { Dish } from "./dish.model";
import { Payment } from "./payment.model";

@Entity()
export class Order {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	status: OrderStatusType;

	@CreateDateColumn()
	date: Date;

	@Column()
	total: number;

	@ManyToOne(() => Table, (table) => table.orders,{onDelete:"CASCADE"})
	table: Table;

	@OneToMany(() => OrderDish, (orderDish) => orderDish.order)
	orderDishes: OrderDish[];

	@ManyToOne(() => Payment, (payment) => payment.orders, {
		onDelete: "SET NULL",
	})
	payment: Payment;
}

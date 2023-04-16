import {
	Column,
	Entity,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { DishIngredient } from "./shared.model";
import { Dish } from "./dish.model";
import { Order } from "./order.model";

@Entity()
export class Payment {
	@PrimaryColumn()
	id: number;

	@Column({ type: "timestamptz", nullable: true })
	date: Date;

	@Column({ nullable: true })
	amount: number;

	@OneToMany(() => Order, (order) => order.payment)
	orders: Order[];
}

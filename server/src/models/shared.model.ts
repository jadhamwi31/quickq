import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dish } from "./dish.model";
import { Ingredient } from "./ingredient.model";
import { Order } from "./order.model";

@Entity()
export class DishIngredient {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Dish, (dish) => dish.dishIngredients, {
		onDelete: "CASCADE",
	})
	dish: Dish;

	@ManyToOne(() => Ingredient, (ingredient) => ingredient.dishIngredients)
	ingredient: Ingredient;

	@Column({ type: "real" })
	amount: number;
}

@Entity()
export class OrderDish {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Order, (order) => order.orderDishes, { onDelete: "CASCADE" })
	order: Order;

	@ManyToOne(() => Dish, (dish) => dish.orderDishes)
	dish: Dish;

	@Column()
	quantity: number;
}

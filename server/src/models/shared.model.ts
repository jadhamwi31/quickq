import {
	Column,
	Entity,
	ManyToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from "typeorm";
import { UserRoleType } from "../ts/types/user.types";
import { Dish } from "./dish.model";
import { Ingredient } from "./ingredient.model";

@Entity()
export class DishIngredient {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Dish, (dish) => dish.dishIngredients)
	dish: Dish;

	@ManyToOne(() => Ingredient, (ingredient) => ingredient.dishIngredients)
	ingredient: Ingredient;

	@Column({ type: "real" })
	amount: number;
}

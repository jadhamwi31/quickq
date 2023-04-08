import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { UserRoleType } from "../ts/types/user.types";
import { Dish } from "./dish.model";
import { Ingredient } from "./ingredient.model";

@Entity()
export class DishIngredient {
	@PrimaryColumn()
	id: number;

	@ManyToOne(() => Dish, (dish) => dish.dishIngredients)
	dish: Dish;

	@ManyToOne(() => Ingredient, (ingredient) => ingredient.dishIngredients)
	ingredient: Ingredient;

	@Column()
	amount: number;
}

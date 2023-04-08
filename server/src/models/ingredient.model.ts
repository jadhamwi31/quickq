import {
	Column,
	Entity,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from "typeorm";
import { UserRoleType } from "../ts/types/user.types";
import { DishIngredient } from "./shared.model";

@Entity()
export class Ingredient {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	unit: string;

	@OneToMany(
		() => DishIngredient,
		(dishIngredient) => dishIngredient.ingredient
	)
	dishIngredients: DishIngredient[];
}

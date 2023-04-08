import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DishIngredient } from "./shared.model";

@Entity()
export class Dish {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	price: number;

	@Column()
	description: string;

	@OneToMany(() => DishIngredient, (dishIngredient) => dishIngredient.dish)
	public dishIngredients: DishIngredient[];
}

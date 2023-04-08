import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { DishIngredient } from "./shared.model";

@Entity()
@Unique(["name"])
export class Dish {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ type: "real" })
	price: number;

	@Column()
	description: string;

	@OneToMany(() => DishIngredient, (dishIngredient) => dishIngredient.dish)
	dishIngredients: Partial<DishIngredient>[];
}

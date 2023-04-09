import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { DishIngredient } from "./shared.model";
import { Category } from "./category.model";

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

	@ManyToOne(() => Category, (category) => category.dishes, {
		onDelete: "SET NULL",
	})
	category: Category;
}

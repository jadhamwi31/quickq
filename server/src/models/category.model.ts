import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { DishIngredient } from "./shared.model";
import { Dish } from "./dish.model";

@Entity()
@Unique(["name"])
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(() => Dish, (dish) => dish.category)
	dishes: Dish[];
}

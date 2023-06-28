import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { DishIngredient } from "./shared.model";
import { Dish } from "./dish.model";
import { MenuCustomization } from "./menu_customization.model";
import * as base64blob from "base64-blob";

@Entity()
@Unique(["name"])
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(() => Dish, (dish) => dish.category)
	dishes: Dish[];

	@Column({ nullable: true })
	image: string;
}


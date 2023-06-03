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

@Entity()
export class CategoryOrder {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(
		() => MenuCustomization,
		(menuCustomization) => menuCustomization.categories_order
	)
	menuCustomization: MenuCustomization;

	@Column()
	order: number;

	@OneToOne(() => Category)
	@JoinColumn()
	category: Category;
}

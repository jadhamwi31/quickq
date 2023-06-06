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

	@Column({
		type: "bytea",
		nullable: false,
	})
	image: Buffer;

	@OneToMany(() => Dish, (dish) => dish.category)
	dishes: Dish[];

	@OneToMany(() => CategoryOrder, (categoryOrder) => categoryOrder.category)
	categories_order: CategoryOrder[];
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

	@ManyToOne(() => Category, (category) => category.categories_order)
	@JoinColumn()
	category: Category;
}

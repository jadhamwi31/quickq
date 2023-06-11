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

	@OneToMany(() => CategoryOrder, (categoryOrder) => categoryOrder.category)
	categories_order: CategoryOrder[];

	@Column({ nullable: true })
	image: string;
}

@Entity()
export class CategoryOrder {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(
		() => MenuCustomization,
		(menuCustomization) => menuCustomization.categories_order,
		{
			onDelete: "CASCADE",
		}
	)
	menuCustomization: MenuCustomization;

	@Column()
	order: number;

	@ManyToOne(() => Category, (category) => category.categories_order, {
		onDelete: "CASCADE",
	})
	@JoinColumn()
	category: Category;
}

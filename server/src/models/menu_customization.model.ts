import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { Ingredient } from "./ingredient.model";
import { CategoryOrder } from "./category.model";

@Entity()
export class MenuCustomization {
	@PrimaryColumn()
	name: string;

	@Column()
	styles: string;

	@Column()
	active: boolean;

	@OneToMany(
		() => CategoryOrder,
		(categoryOrder) => categoryOrder.menuCustomization
	)
	categories_order: CategoryOrder[];
}

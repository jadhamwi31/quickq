import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { Ingredient } from "./ingredient.model";

@Entity()
export class InventoryItem {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Ingredient)
	@JoinColumn()
	ingredient: Ingredient;

	@Column()
	available: number;

	@Column()
	needed: number;
}
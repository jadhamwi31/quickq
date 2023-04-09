import { IIngredient } from "./ingredient.interfaces";

export interface IDishIngredient {
	name: string;
	amount: number;
}

export interface IDish {
	name: string;
	price: number;
	description: string;
	ingredients: IDishIngredient[];
}

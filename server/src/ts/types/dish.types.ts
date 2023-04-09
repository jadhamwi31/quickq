import { IDish, IDishIngredient } from "../interfaces/dish.interfaces";
import { IIngredient } from "../interfaces/ingredient.interfaces";

export type GetDishesQueryResultType = ({
	dishIngredients: { amount: number; ingredient: IIngredient }[];
} & Omit<IDish, "ingredients">)[];

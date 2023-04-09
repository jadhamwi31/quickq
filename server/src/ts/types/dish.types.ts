import { Category } from "../../models/category.model";
import { IDish, IDishIngredient } from "../interfaces/dish.interfaces";
import { IIngredient } from "../interfaces/ingredient.interfaces";

export type GetDishesQueryResultType = ({
	dishIngredients: { amount: number; ingredient: IIngredient }[];
	category: Pick<Category, "name">;
} & Omit<IDish, "ingredients" | "category">)[];

import { AppDataSource } from "../models";
import { ConflictError, NotFoundError } from "../models/error.model";
import { Ingredient } from "../models/ingredient.model";

const createNewIngredient = async (
	ingredient: Pick<Ingredient, "name" | "unit">
) => {
	const ingredientsRepo = AppDataSource.getRepository(Ingredient);
	const ingredientExists = await ingredientsRepo.findOneBy({
		name: ingredient.name,
	});
	if (ingredientExists) {
		throw new ConflictError("ingredient exists");
	}
	await ingredientsRepo.save(ingredient);
};

const deleteIngredient = async (name: string) => {
	const ingredientsRepo = AppDataSource.getRepository(Ingredient);
	const ingredientExists = await ingredientsRepo.findOneBy({
		name,
	});
	if (!ingredientExists) {
		throw new NotFoundError("ingredient not found");
	}
	await ingredientsRepo.delete({ name });
};

export const IngredientsService = { createNewIngredient, deleteIngredient };

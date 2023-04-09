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
		throw new ConflictError("ingredient does exist");
	}
	await ingredientsRepo.insert(ingredient);
};

const updateIngredient = async (
	name: string,
	ingredient: Pick<Ingredient, "name" | "unit">
) => {
	const ingredientsRepo = AppDataSource.getRepository(Ingredient);
	const ingredientRecord = await ingredientsRepo.findOneBy({
		name,
	});
	if (ingredientRecord) {
		ingredientRecord.name = ingredient.name;
		ingredientRecord.unit = ingredient.unit;
		await ingredientsRepo.save(ingredientRecord);
	} else {
		throw new ConflictError("ingredient does not exist");
	}
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

const getIngredients = async () => {
	const ingredientsRepo = AppDataSource.getRepository(Ingredient);
	return (await ingredientsRepo.find()).map((ingredient) => ({
		name: ingredient.name,
		unit: ingredient.unit,
	}));
};

export const IngredientsService = {
	createNewIngredient,
	deleteIngredient,
	getIngredients,
	updateIngredient,
};

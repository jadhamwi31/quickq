import { AppDataSource } from "../models";
import { ConflictError, NotFoundError } from "../models/error.model";
import { Ingredient } from "../models/ingredient.model";
import { InventoryItem } from "../models/inventory_item.model";
import { IRedisInventoryItem } from "../ts/interfaces/inventory.interfaces";
import RedisService from "./redis.service";

const createNewIngredient = async (
	ingredient: Pick<Ingredient, "name" | "unit">
) => {
	const ingredientsRepo = AppDataSource.getRepository(Ingredient);
	const inventoryItemsRepo = AppDataSource.getRepository(InventoryItem);
	const ingredientExists = await ingredientsRepo.findOneBy({
		name: ingredient.name,
	});
	if (ingredientExists) {
		throw new ConflictError("ingredient does exist");
	}
	const ingredientRecord = new Ingredient();
	ingredientRecord.name = ingredient.name;
	ingredientRecord.unit = ingredient.unit;
	await ingredientsRepo.save(ingredientRecord);
	const inventoryItem = new InventoryItem();
	inventoryItem.ingredient = ingredientRecord;
	inventoryItem.available = 0;
	inventoryItem.needed = 0;	
	await inventoryItemsRepo.save(inventoryItem);
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
		if (ingredient.name) ingredientRecord.name = ingredient.name;
		if (ingredient.unit) ingredientRecord.unit = ingredient.unit;
		await ingredientsRepo.save(ingredientRecord);
	} else {
		throw new NotFoundError("ingredient does not exist");
	}
};

const deleteIngredient = async (name: string) => {
	const ingredientsRepo = AppDataSource.getRepository(Ingredient);
	const ingredientRecord = await ingredientsRepo.findOneBy({
		name,
	});
	if (!ingredientRecord) {
		throw new NotFoundError("ingredient not found");
	}

	await ingredientsRepo.remove(ingredientRecord);
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

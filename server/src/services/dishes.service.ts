import { AppDataSource } from "../models";
import { Dish } from "../models/dish.model";
import { NotFoundError } from "../models/error.model";
import { Ingredient } from "../models/ingredient.model";
import { DishIngredient } from "../models/shared.model";
import { IDish } from "../ts/interfaces/dish.interfaces";
import { GetDishesQueryResultType } from "../ts/types/dish.types";

const createNewDish = async (dish: IDish) => {
	const ingredientsRepo = AppDataSource.getRepository(Ingredient);
	const dishesRepo = AppDataSource.getRepository(Dish);
	const dishesIngredientsRepo = AppDataSource.getRepository(DishIngredient);
	const { ingredients } = dish;
	const dishRecord = new Dish();
	const dishesIngredientsToSave: DishIngredient[] = [];
	dishRecord.name = dish.name;
	dishRecord.price = dish.price;
	dishRecord.description = dish.description;
	dishRecord.dishIngredients = [];
	await dishesRepo.insert(dishRecord);
	for (const ingredient of ingredients) {
		const ingredientRecord = await ingredientsRepo.findOneBy({
			name: ingredient.name,
		});
		if (!ingredientRecord) {
			await dishesRepo.delete(dishRecord);
			throw new NotFoundError(`ingredient ${ingredient} not found`);
		}
		const dishIngredient = new DishIngredient();

		dishIngredient.dish = dishRecord;
		dishIngredient.ingredient = ingredientRecord;
		dishIngredient.amount = ingredient.amount;
		dishesIngredientsToSave.push(dishIngredient);
		dishRecord.dishIngredients.push(dishIngredient);
	}
	await dishesIngredientsRepo.save(dishesIngredientsToSave);
	await dishesRepo.save(dishRecord);
};

export const deleteDish = async (name: string) => {
	const dishesRepo = AppDataSource.getRepository(Dish);
	const dishesIngredientsRepo = AppDataSource.getRepository(DishIngredient);
	const dishRecord = await dishesRepo.findOneBy({ name });
	if (!dishRecord) {
		throw new NotFoundError("dish not found");
	}
	await dishesRepo.delete(dishRecord);

	await dishesIngredientsRepo.delete({ dish: dishRecord });
};

const getDishes = async () => {
	const _dishes = (await AppDataSource.getRepository(Dish)
		.createQueryBuilder("dish")
		.leftJoinAndSelect("dish.dishIngredients", "dish_ingredient")
		.leftJoinAndSelect("dish_ingredient.ingredient", "ingredient")
		.select([
			"dish.name",
			"dish.description",
			"dish.price",
			"dish_ingredient.amount",
			"ingredient.name",
			"ingredient.unit",
		])
		.getMany()) as unknown as GetDishesQueryResultType;
	const dishes = _dishes.map((dish) => ({
		name: dish.name,
		description: dish.description,
		price: dish.price,
		ingredients: dish.dishIngredients.map((ingredient) => ({
			name: ingredient.ingredient.name,
			unit: ingredient.ingredient.unit,
		})),
	}));
	return dishes;
};

export const DishesService = {
	createNewDish,
	deleteDish,
	getDishes,
};

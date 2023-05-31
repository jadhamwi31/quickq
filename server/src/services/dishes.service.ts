import _ from "lodash";
import { AppDataSource } from "../models";
import { Dish } from "../models/dish.model";
import {
	BadRequestError,
	ConflictError,
	NotFoundError,
} from "../models/error.model";
import { Ingredient } from "../models/ingredient.model";
import { DishIngredient } from "../models/shared.model";
import { IDish } from "../ts/interfaces/dish.interfaces";
import {
	GetDishesQueryResultType,
	RedisDishesType,
} from "../ts/types/dish.types";
import { Category } from "../models/category.model";
import RedisService from "./redis.service";

const createNewDish = async (dish: IDish) => {
	const ingredientsRepo = AppDataSource.getRepository(Ingredient);
	const dishesRepo = AppDataSource.getRepository(Dish);
	const categoriesRepo = AppDataSource.getRepository(Category);
	const dishesIngredientsRepo = AppDataSource.getRepository(DishIngredient);
	const dishExists = await dishesRepo.findOneBy({ name: dish.name });
	if (dishExists) {
		throw new ConflictError(`dish ${dish.name} does exist`);
	}
	const { ingredients } = dish;
	const dishRecord = new Dish();
	const categoryRecord = await categoriesRepo.findOneBy({
		name: dish.category,
	});
	if (!categoryRecord) {
		throw new NotFoundError("category not found");
	}
	const dishesIngredientsToSave: DishIngredient[] = [];
	dishRecord.name = dish.name;
	dishRecord.price = dish.price;
	dishRecord.description = dish.description;
	dishRecord.dishIngredients = [];
	dishRecord.category = categoryRecord;
	await dishesRepo.save(dishRecord);
	for (const ingredient of ingredients) {
		const ingredientRecord = await ingredientsRepo.findOneBy({
			name: ingredient.name,
		});

		if (_.isNull(ingredientRecord)) {
			await dishesRepo.remove(dishRecord);
			throw new NotFoundError(`ingredient ${ingredient.name} not found`);
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

	const redisDish = {
		name: dishRecord.name,
		price: dishRecord.price,
		description: dishRecord.description,
		ingredients: dishRecord.dishIngredients.map((ingredient) => ({
			name: ingredient.ingredient.name,
			amount: ingredient.amount,
			unit: ingredient.ingredient.unit,
		})),
		category: dishRecord.category.name,
	};
	await RedisService.redis.hset(
		"dishes",
		dishRecord.id,
		JSON.stringify(redisDish)
	);
};

export const deleteDish = async (name: string) => {
	const dishesRepo = AppDataSource.getRepository(Dish);
	const dishesIngredientsRepo = AppDataSource.getRepository(DishIngredient);
	const dishRecord = await dishesRepo.findOneBy({ name });
	if (!dishRecord) {
		throw new NotFoundError("dish not found");
	}
	await dishesRepo.remove(dishRecord);
	const dishesIngredients = await dishesIngredientsRepo.find({
		where: { dish: dishRecord },
		relations: { dish: true },
	});
	await dishesIngredientsRepo.remove(dishesIngredients);
	await RedisService.redis.hdel("dishes", String(dishRecord.id));
};

const getDishes = async () => {
	const areDishesCached = RedisService.isCached("dishes");

	if (areDishesCached) {
		const dishes: RedisDishesType = Object.values(
			await RedisService.redis.hgetall("dishes")
		).map((dish) => JSON.parse(dish));
		return dishes;
	} else {
		const _dishes = await AppDataSource.getRepository(Dish)
			.createQueryBuilder("dish")
			.leftJoinAndSelect("dish.dishIngredients", "dish_ingredient")
			.leftJoinAndSelect("dish_ingredient.ingredient", "ingredient")
			.leftJoinAndSelect("dish.category", "category")
			.select([
				"dish.id",
				"dish.name",
				"dish.description",
				"dish.price",
				"dish_ingredient.amount",
				"ingredient.name",
				"ingredient.unit",
				"category.name",
			])
			.getMany();

		const dishes: RedisDishesType = [];
		const redisDishesToSet: { [orderId: string]: string } = {};
		for (const dish of _dishes) {
			const dishObject = {
				name: dish.name,
				description: dish.description,
				price: dish.price,
				ingredients: dish.dishIngredients.map((ingredient) => ({
					name: ingredient.ingredient.name,
					amount: ingredient.amount,
					unit: ingredient.ingredient.unit,
				})),
				category: dish.category?.name,
			};
			dishes.push(dishObject);
			redisDishesToSet[dish.id] = JSON.stringify(dishObject);
		}

		await RedisService.redis.hmset("dishes", redisDishesToSet);
		return dishes;
	}
};

const updateDish = async (dishName: string, dish: IDish) => {
	const dishesRepo = AppDataSource.getRepository(Dish);

	const dishRecord = await dishesRepo.findOneBy({ name: dishName });
	if (!dishRecord) {
		throw new NotFoundError("dish to update : not found");
	}

	dishRecord.name = dish.name;
	dishRecord.price = dish.price;
	await dishesRepo.save(dishRecord);

	const prevRedisDish = JSON.parse(
		await RedisService.redis.hget("dishes", String(dishRecord.id))
	);

	const redisDish = {
		...prevRedisDish,
		name: dishRecord.name,
		price: dishRecord.price,
	};
	await RedisService.redis.hset(
		"dishes",
		dishRecord.id,
		JSON.stringify(redisDish)
	);
};

export const DishesService = {
	createNewDish,
	deleteDish,
	getDishes,
	updateDish,
};

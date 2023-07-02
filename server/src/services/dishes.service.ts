import _, {isEmpty} from "lodash";
import {AppDataSource} from "../models";
import {Category} from "../models/category.model";
import {Dish} from "../models/dish.model";
import {ConflictError, NotFoundError} from "../models/error.model";
import {Ingredient} from "../models/ingredient.model";
import {DishIngredient} from "../models/shared.model";
import {IDish} from "../ts/interfaces/dish.interfaces";
import {RedisDishType, RedisDishesType} from "../ts/types/dish.types";
import RedisService from "./redis.service";
import {deleteImage} from "./upload.service";
import {Payment} from "../models/payment.model";
import moment from "moment";


const getDishById = async (dishId: number) => {

    if (await RedisService.isCached("dishes", String(dishId))) {
        return JSON.parse(await RedisService.getCachedVersion("dishes", String(dishId)))
    } else {
        const dishesRepo = AppDataSource.getRepository(Dish);
        const dishRecord = (await dishesRepo.findOne({
            where: {id: dishId},
            relations: {dishIngredients: {ingredient:true}, category: true}
        }))

        if (dishRecord) {
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
                image: dishRecord.image,
            };
            await RedisService.redis.hset("dishes", String(dishId), JSON.stringify(redisDish))
            return redisDish;
        }else{
            throw new NotFoundError("dish not found")
        }
    }
}

const createNewDish = async (dish: IDish) => {
    const ingredientsRepo = AppDataSource.getRepository(Ingredient);
    const dishesRepo = AppDataSource.getRepository(Dish);
    const categoriesRepo = AppDataSource.getRepository(Category);
    const dishesIngredientsRepo = AppDataSource.getRepository(DishIngredient);
    const dishExists = await dishesRepo.findOne({
        where: {name: dish.name},
        relations: {category: true, dishIngredients: true},
    });
    if (dishExists) {
        throw new ConflictError(`dish ${dish.name} does exist`);
    }
    const {ingredients} = dish;
    const dishRecord = new Dish();
    const categoryRecord = await categoriesRepo.findOneBy({
        name: dish.category,
    });
    if (!categoryRecord) {
        throw new NotFoundError("category not found");
    }
    const dishesIngredientsToSave: DishIngredient[] = [];
    dishRecord.name = dish.name;
    dishRecord.price = Number(dish.price);
    dishRecord.description = dish.description;
    dishRecord.dishIngredients = [];
    dishRecord.category = categoryRecord;
    if (dish.image) {
        dishRecord.image = dish.image;
    }

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
        image: dishRecord.image,
    };
    await RedisService.redis.hset(
        "dishes",
        String(dishRecord.id),
        JSON.stringify(redisDish)
    );
    await RedisService.redis.del("prices:predictions")
};

export const deleteDish = async (name: string) => {
    const dishesRepo = AppDataSource.getRepository(Dish);
    const dishesIngredientsRepo = AppDataSource.getRepository(DishIngredient);
    const dishRecord = await dishesRepo.findOneBy({name});
    if (!dishRecord) {
        throw new NotFoundError("dish not found");
    }

    const dishId = dishRecord.id;
    if (dishRecord.image) {
        deleteImage(dishRecord.image);
    }
    await dishesRepo.remove(dishRecord);
    const dishesIngredients = await dishesIngredientsRepo.find({
        where: {dish: dishRecord},
        relations: {dish: true},
    });
    await dishesIngredientsRepo.remove(dishesIngredients);

    await RedisService.redis.hdel("dishes", String(dishId));
    await RedisService.redis.del("prices:predictions")
};

const getDishes = async () => {
    const areDishesCached = await RedisService.isCached("dishes");

    if (areDishesCached) {
        RedisService.cacheLog("dishes");
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
                "dish.image",
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
                image: dish.image,
            };
            dishes.push(dishObject);
            redisDishesToSet[dish.id] = JSON.stringify(dishObject);
        }
        if (!isEmpty(redisDishesToSet)) {

            await RedisService.redis.hmset("dishes", redisDishesToSet);
        }
        return dishes;
    }
};

const updateDish = async (dishName: string, dish: Partial<IDish>) => {
    const dishesRepo = AppDataSource.getRepository(Dish);

    const dishRecord = await dishesRepo.findOne({
        relations: {dishIngredients: {ingredient:true,dish:true}, category: true},
        where: {name: dishName},
    });
    if (!dishRecord) {
        throw new NotFoundError("dish to update : not found");
    }

    if (dish.image) {
        if (dishRecord.image) {
            deleteImage(dishRecord.image);
        }
        dishRecord.image = dish.image;
    }

    if (dish.name) dishRecord.name = dish.name;
    if (dish.price) dishRecord.price = dish.price;
    if (dish.description) dishRecord.description = dish.description;

    if (dish.ingredients) {
        await AppDataSource.getRepository(DishIngredient).delete({
            dish: {id: dishRecord.id},
        });
        const dishIngredientsRepo = AppDataSource.getRepository(DishIngredient);
        const ingredientsRepo = AppDataSource.getRepository(Ingredient);
        const dishIngredientsToSave: DishIngredient[] = [];
        for (const ingredient of dish.ingredients) {
            const ingredientRecord = await ingredientsRepo.findOneBy({
                name: ingredient.name,
            });
            if (!ingredientRecord) {
                throw new NotFoundError(`ingredient ${ingredient.name} was not found`);
            }
            const dishIngredient = new DishIngredient();
            dishIngredient.dish = dishRecord;
            dishIngredient.amount = ingredient.amount;
            dishIngredient.ingredient = ingredientRecord;
            dishIngredientsToSave.push(dishIngredient);
        }
        await dishIngredientsRepo.save(dishIngredientsToSave);
        dishRecord.dishIngredients = dishIngredientsToSave;
    }

    if (dish.category) {
        const categoryRecord = await AppDataSource.getRepository(
            Category
        ).findOneBy({name: dish.category});
        if (!categoryRecord) {
            throw new NotFoundError(`category ${dish.category} not found`);
        }
        dishRecord.category = categoryRecord;
    }

    await dishesRepo.save(dishRecord);

    const redisDish: RedisDishType = {
        name: dishRecord.name,
        price: dishRecord.price,
        image: dishRecord.image,
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
        String(dishRecord.id),
        JSON.stringify(redisDish)
    );
    await RedisService.redis.del("prices:predictions")
};


export const DishesService = {
    createNewDish,
    deleteDish,
    getDishes,
    updateDish,
    getDishById
};

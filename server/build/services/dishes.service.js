"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishesService = exports.deleteDish = void 0;
const lodash_1 = __importStar(require("lodash"));
const models_1 = require("../models");
const category_model_1 = require("../models/category.model");
const dish_model_1 = require("../models/dish.model");
const error_model_1 = require("../models/error.model");
const ingredient_model_1 = require("../models/ingredient.model");
const shared_model_1 = require("../models/shared.model");
const redis_service_1 = __importDefault(require("./redis.service"));
const upload_service_1 = require("./upload.service");
const getDishById = (dishId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(dishId);
    if (yield redis_service_1.default.isCached("dishes", String(dishId))) {
        return JSON.parse(yield redis_service_1.default.getCachedVersion("dishes", String(dishId)));
    }
    else {
        const dishesRepo = models_1.AppDataSource.getRepository(dish_model_1.Dish);
        const dishRecord = (yield dishesRepo.findOne({
            where: { id: dishId },
            relations: { dishIngredients: { ingredient: true }, category: true }
        }));
        console.log(dishRecord);
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
            yield redis_service_1.default.redis.hset("dishes", String(dishId), JSON.stringify(redisDish));
            return redisDish;
        }
        else {
            throw new error_model_1.NotFoundError("dish not found");
        }
    }
});
const createNewDish = (dish) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientsRepo = models_1.AppDataSource.getRepository(ingredient_model_1.Ingredient);
    const dishesRepo = models_1.AppDataSource.getRepository(dish_model_1.Dish);
    const categoriesRepo = models_1.AppDataSource.getRepository(category_model_1.Category);
    const dishesIngredientsRepo = models_1.AppDataSource.getRepository(shared_model_1.DishIngredient);
    const dishExists = yield dishesRepo.findOne({
        where: { name: dish.name },
        relations: { category: true, dishIngredients: true },
    });
    if (dishExists) {
        throw new error_model_1.ConflictError(`dish ${dish.name} does exist`);
    }
    const { ingredients } = dish;
    const dishRecord = new dish_model_1.Dish();
    const categoryRecord = yield categoriesRepo.findOneBy({
        name: dish.category,
    });
    if (!categoryRecord) {
        throw new error_model_1.NotFoundError("category not found");
    }
    const dishesIngredientsToSave = [];
    dishRecord.name = dish.name;
    dishRecord.price = Number(dish.price);
    dishRecord.description = dish.description;
    dishRecord.dishIngredients = [];
    dishRecord.category = categoryRecord;
    if (dish.image) {
        dishRecord.image = dish.image;
    }
    yield dishesRepo.save(dishRecord);
    for (const ingredient of ingredients) {
        const ingredientRecord = yield ingredientsRepo.findOneBy({
            name: ingredient.name,
        });
        if (lodash_1.default.isNull(ingredientRecord)) {
            yield dishesRepo.remove(dishRecord);
            throw new error_model_1.NotFoundError(`ingredient ${ingredient.name} not found`);
        }
        const dishIngredient = new shared_model_1.DishIngredient();
        dishIngredient.dish = dishRecord;
        dishIngredient.ingredient = ingredientRecord;
        dishIngredient.amount = ingredient.amount;
        dishesIngredientsToSave.push(dishIngredient);
        dishRecord.dishIngredients.push(dishIngredient);
    }
    yield dishesIngredientsRepo.save(dishesIngredientsToSave);
    yield dishesRepo.save(dishRecord);
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
    yield redis_service_1.default.redis.hset("dishes", String(dishRecord.id), JSON.stringify(redisDish));
});
const deleteDish = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const dishesRepo = models_1.AppDataSource.getRepository(dish_model_1.Dish);
    const dishesIngredientsRepo = models_1.AppDataSource.getRepository(shared_model_1.DishIngredient);
    const dishRecord = yield dishesRepo.findOneBy({ name });
    if (!dishRecord) {
        throw new error_model_1.NotFoundError("dish not found");
    }
    const dishId = dishRecord.id;
    if (dishRecord.image) {
        (0, upload_service_1.deleteImage)(dishRecord.image);
    }
    yield dishesRepo.remove(dishRecord);
    const dishesIngredients = yield dishesIngredientsRepo.find({
        where: { dish: dishRecord },
        relations: { dish: true },
    });
    yield dishesIngredientsRepo.remove(dishesIngredients);
    yield redis_service_1.default.redis.hdel("dishes", String(dishId));
});
exports.deleteDish = deleteDish;
const getDishes = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const areDishesCached = yield redis_service_1.default.isCached("dishes");
    if (areDishesCached) {
        redis_service_1.default.cacheLog("dishes");
        const dishes = Object.values(yield redis_service_1.default.redis.hgetall("dishes")).map((dish) => JSON.parse(dish));
        return dishes;
    }
    else {
        const _dishes = yield models_1.AppDataSource.getRepository(dish_model_1.Dish)
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
        const dishes = [];
        const redisDishesToSet = {};
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
                category: (_a = dish.category) === null || _a === void 0 ? void 0 : _a.name,
                image: dish.image,
            };
            dishes.push(dishObject);
            redisDishesToSet[dish.id] = JSON.stringify(dishObject);
        }
        if (!(0, lodash_1.isEmpty)(redisDishesToSet)) {
            yield redis_service_1.default.redis.hmset("dishes", redisDishesToSet);
        }
        return dishes;
    }
});
const updateDish = (dishName, dish) => __awaiter(void 0, void 0, void 0, function* () {
    const dishesRepo = models_1.AppDataSource.getRepository(dish_model_1.Dish);
    const dishRecord = yield dishesRepo.findOne({
        relations: { dishIngredients: { ingredient: true, dish: true }, category: true },
        where: { name: dishName },
    });
    if (!dishRecord) {
        throw new error_model_1.NotFoundError("dish to update : not found");
    }
    if (dish.image) {
        if (dishRecord.image) {
            (0, upload_service_1.deleteImage)(dishRecord.image);
        }
        dishRecord.image = dish.image;
    }
    if (dish.name)
        dishRecord.name = dish.name;
    if (dish.price)
        dishRecord.price = dish.price;
    if (dish.description)
        dishRecord.description = dish.description;
    if (dish.ingredients) {
        yield models_1.AppDataSource.getRepository(shared_model_1.DishIngredient).delete({
            dish: { id: dishRecord.id },
        });
        const dishIngredientsRepo = models_1.AppDataSource.getRepository(shared_model_1.DishIngredient);
        const ingredientsRepo = models_1.AppDataSource.getRepository(ingredient_model_1.Ingredient);
        const dishIngredientsToSave = [];
        for (const ingredient of dish.ingredients) {
            const ingredientRecord = yield ingredientsRepo.findOneBy({
                name: ingredient.name,
            });
            if (!ingredientRecord) {
                throw new error_model_1.NotFoundError(`ingredient ${ingredient.name} was not found`);
            }
            const dishIngredient = new shared_model_1.DishIngredient();
            dishIngredient.dish = dishRecord;
            dishIngredient.amount = ingredient.amount;
            dishIngredient.ingredient = ingredientRecord;
            dishIngredientsToSave.push(dishIngredient);
        }
        yield dishIngredientsRepo.save(dishIngredientsToSave);
        dishRecord.dishIngredients = dishIngredientsToSave;
    }
    if (dish.category) {
        const categoryRecord = yield models_1.AppDataSource.getRepository(category_model_1.Category).findOneBy({ name: dish.category });
        if (!categoryRecord) {
            throw new error_model_1.NotFoundError(`category ${dish.category} not found`);
        }
        dishRecord.category = categoryRecord;
    }
    yield dishesRepo.save(dishRecord);
    const redisDish = {
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
    yield redis_service_1.default.redis.hset("dishes", String(dishRecord.id), JSON.stringify(redisDish));
});
exports.DishesService = {
    createNewDish,
    deleteDish: exports.deleteDish,
    getDishes,
    updateDish,
    getDishById
};

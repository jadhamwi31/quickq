"use strict";
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
const lodash_1 = __importDefault(require("lodash"));
const models_1 = require("../models");
const dish_model_1 = require("../models/dish.model");
const error_model_1 = require("../models/error.model");
const ingredient_model_1 = require("../models/ingredient.model");
const shared_model_1 = require("../models/shared.model");
const category_model_1 = require("../models/category.model");
const createNewDish = (dish) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientsRepo = models_1.AppDataSource.getRepository(ingredient_model_1.Ingredient);
    const dishesRepo = models_1.AppDataSource.getRepository(dish_model_1.Dish);
    const categoriesRepo = models_1.AppDataSource.getRepository(category_model_1.Category);
    const dishesIngredientsRepo = models_1.AppDataSource.getRepository(shared_model_1.DishIngredient);
    const dishExists = yield dishesRepo.findOneBy({ name: dish.name });
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
    dishRecord.price = dish.price;
    dishRecord.description = dish.description;
    dishRecord.dishIngredients = [];
    dishRecord.category = categoryRecord;
    yield dishesRepo.insert(dishRecord);
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
});
const deleteDish = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const dishesRepo = models_1.AppDataSource.getRepository(dish_model_1.Dish);
    const dishesIngredientsRepo = models_1.AppDataSource.getRepository(shared_model_1.DishIngredient);
    const dishRecord = yield dishesRepo.findOneBy({ name });
    if (!dishRecord) {
        throw new error_model_1.NotFoundError("dish not found");
    }
    yield dishesRepo.remove(dishRecord);
    yield dishesIngredientsRepo.delete({ dish: dishRecord });
});
exports.deleteDish = deleteDish;
const getDishes = () => __awaiter(void 0, void 0, void 0, function* () {
    const _dishes = (yield models_1.AppDataSource.getRepository(dish_model_1.Dish)
        .createQueryBuilder("dish")
        .leftJoinAndSelect("dish.dishIngredients", "dish_ingredient")
        .leftJoinAndSelect("dish_ingredient.ingredient", "ingredient")
        .leftJoinAndSelect("dish.category", "category")
        .select([
        "dish.name",
        "dish.description",
        "dish.price",
        "dish_ingredient.amount",
        "ingredient.name",
        "ingredient.unit",
        "category.name",
    ])
        .getMany());
    const dishes = _dishes.map((dish) => {
        var _a;
        return ({
            name: dish.name,
            description: dish.description,
            price: dish.price,
            ingredients: dish.dishIngredients.map((ingredient) => ({
                name: ingredient.ingredient.name,
                unit: ingredient.ingredient.unit,
            })),
            category: (_a = dish.category) === null || _a === void 0 ? void 0 : _a.name,
        });
    });
    return dishes;
});
const updateDish = (dishName, dish) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientsRepo = models_1.AppDataSource.getRepository(ingredient_model_1.Ingredient);
    const dishesRepo = models_1.AppDataSource.getRepository(dish_model_1.Dish);
    const dishesIngredientsRepo = models_1.AppDataSource.getRepository(shared_model_1.DishIngredient);
    const { ingredients } = dish;
    const dishRecord = yield dishesRepo.findOneBy({ name: dishName });
    if (!dishRecord) {
        throw new error_model_1.NotFoundError("dish to update : not found");
    }
    const dishesIngredientsToSave = [];
    dishRecord.dishIngredients = [];
    for (const ingredient of ingredients) {
        const ingredientRecord = yield ingredientsRepo.findOneBy({
            name: ingredient.name,
        });
        if (!ingredientRecord) {
            yield dishesRepo.remove(dishRecord);
            throw new error_model_1.NotFoundError(`ingredient ${ingredient} not found`);
        }
        const dishIngredient = yield dishesIngredientsRepo.findOneBy({
            dish: dishRecord,
        });
        dishIngredient.dish = dishRecord;
        dishIngredient.ingredient = ingredientRecord;
        dishIngredient.amount = ingredient.amount;
        dishesIngredientsToSave.push(dishIngredient);
        dishRecord.dishIngredients.push(dishIngredient);
    }
    dishRecord.name = dish.name;
    dishRecord.price = dish.price;
    dishRecord.description = dish.description;
    yield dishesIngredientsRepo.save(dishesIngredientsToSave);
    yield dishesRepo.save(dishRecord);
});
exports.DishesService = {
    createNewDish,
    deleteDish: exports.deleteDish,
    getDishes,
    updateDish,
};

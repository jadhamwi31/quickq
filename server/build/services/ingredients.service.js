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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientsService = void 0;
const models_1 = require("../models");
const error_model_1 = require("../models/error.model");
const ingredient_model_1 = require("../models/ingredient.model");
const inventory_item_model_1 = require("../models/inventory_item.model");
const createNewIngredient = (ingredient) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientsRepo = models_1.AppDataSource.getRepository(ingredient_model_1.Ingredient);
    const inventoryItemsRepo = models_1.AppDataSource.getRepository(inventory_item_model_1.InventoryItem);
    const ingredientExists = yield ingredientsRepo.findOneBy({
        name: ingredient.name,
    });
    if (ingredientExists) {
        throw new error_model_1.ConflictError("ingredient does exist");
    }
    const ingredientRecord = new ingredient_model_1.Ingredient();
    ingredientRecord.name = ingredient.name;
    ingredientRecord.unit = ingredient.unit;
    yield ingredientsRepo.save(ingredientRecord);
    const inventoryItem = new inventory_item_model_1.InventoryItem();
    inventoryItem.ingredient = ingredientRecord;
    inventoryItem.available = 0;
    inventoryItem.needed = 0;
    yield inventoryItemsRepo.save(inventoryItem);
});
const updateIngredient = (name, ingredient) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientsRepo = models_1.AppDataSource.getRepository(ingredient_model_1.Ingredient);
    const ingredientRecord = yield ingredientsRepo.findOneBy({
        name,
    });
    if (ingredientRecord) {
        if (ingredient.name)
            ingredientRecord.name = ingredient.name;
        if (ingredient.unit)
            ingredientRecord.unit = ingredient.unit;
        yield ingredientsRepo.save(ingredientRecord);
    }
    else {
        throw new error_model_1.NotFoundError("ingredient does not exist");
    }
});
const deleteIngredient = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientsRepo = models_1.AppDataSource.getRepository(ingredient_model_1.Ingredient);
    const ingredientRecord = yield ingredientsRepo.findOneBy({
        name,
    });
    if (!ingredientRecord) {
        throw new error_model_1.NotFoundError("ingredient not found");
    }
    yield ingredientsRepo.remove(ingredientRecord);
});
const getIngredients = () => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientsRepo = models_1.AppDataSource.getRepository(ingredient_model_1.Ingredient);
    return (yield ingredientsRepo.find()).map((ingredient) => ({
        name: ingredient.name,
        unit: ingredient.unit,
    }));
});
exports.IngredientsService = {
    createNewIngredient,
    deleteIngredient,
    getIngredients,
    updateIngredient,
};

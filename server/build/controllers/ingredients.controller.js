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
exports.IngredientsController = void 0;
const ingredients_service_1 = require("../services/ingredients.service");
const http_status_codes_1 = require("http-status-codes");
const createNewIngredientHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, unit } = req.body;
    try {
        yield ingredients_service_1.IngredientsService.createNewIngredient({ name, unit });
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ message: "ingredient created", code: http_status_codes_1.StatusCodes.OK });
    }
    catch (e) {
        next(e);
    }
});
const updateIngredientHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, unit } = req.body;
    const ingredientName = req.params.name;
    try {
        yield ingredients_service_1.IngredientsService.updateIngredient(ingredientName, { name, unit });
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ message: "ingredient updated", code: http_status_codes_1.StatusCodes.OK });
    }
    catch (e) {
        next(e);
    }
});
const deleteIngredientHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        yield ingredients_service_1.IngredientsService.deleteIngredient(name);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ message: "ingredient resource deleted", code: http_status_codes_1.StatusCodes.OK });
    }
    catch (e) {
        next(e);
    }
});
const getIngredientsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingredients = yield ingredients_service_1.IngredientsService.getIngredients();
        return res.status(http_status_codes_1.StatusCodes.OK).send(ingredients);
    }
    catch (e) {
        next(e);
    }
});
exports.IngredientsController = {
    createNewIngredientHandler,
    deleteIngredientHandler,
    getIngredientsHandler,
    updateIngredientHandler,
};

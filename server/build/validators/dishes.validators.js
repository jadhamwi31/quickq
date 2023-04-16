"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishesValidator = void 0;
const error_model_1 = require("../models/error.model");
const validateCreateNewDish = (req, res, next) => {
    const { name, description, price, ingredients, category } = req.body;
    if (!name) {
        return next(new error_model_1.BadRequestError("name is required"));
    }
    if (!category) {
        return next(new error_model_1.BadRequestError("category is required"));
    }
    if (!description) {
        return next(new error_model_1.BadRequestError("description is required"));
    }
    if (!price) {
        return next(new error_model_1.BadRequestError("price is required"));
    }
    if (!ingredients || ingredients.length === 0) {
        return next(new error_model_1.BadRequestError("ingredients are required"));
    }
    return next();
};
const validateDeleteDish = (req, res, next) => {
    const { name } = req.params;
    if (!name) {
        return next(new error_model_1.BadRequestError("name is required"));
    }
    return next();
};
const validateUpdateDish = (req, res, next) => {
    const { name, description, price, ingredients } = req.body;
    const dishName = req.params.name;
    if (!name) {
        return next(new error_model_1.BadRequestError("key : name is required"));
    }
    if (!description) {
        return next(new error_model_1.BadRequestError("key : description is required"));
    }
    if (!price) {
        return next(new error_model_1.BadRequestError("key : price is required"));
    }
    if (!ingredients || ingredients.length === 0) {
        return next(new error_model_1.BadRequestError("key : ingredients is required"));
    }
    if (!dishName) {
        return next(new error_model_1.BadRequestError("dish name parameter is missing"));
    }
    return next();
};
exports.DishesValidator = {
    validateCreateNewDish,
    validateDeleteDish,
    validateUpdateDish,
};

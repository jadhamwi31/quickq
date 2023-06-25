"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesValidators = void 0;
const error_model_1 = require("../models/error.model");
const validateCreateNewCategory = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return next(new error_model_1.BadRequestError("name is required"));
    }
    return next();
};
const validateDeleteCategory = (req, res, next) => {
    const { name } = req.params;
    if (!name) {
        return next(new error_model_1.BadRequestError("name parameter is required"));
    }
    return next();
};
const validateUpdateCategory = (req, res, next) => {
    const categoryName = req.params.name;
    const { name, image } = req.body;
    if (!name) {
        return next(new error_model_1.BadRequestError("key : [name] is required"));
    }
    if (!categoryName && !image) {
        return next(new error_model_1.BadRequestError("new category name or image is required"));
    }
    return next();
};
exports.CategoriesValidators = {
    validateCreateNewCategory,
    validateDeleteCategory,
    validateUpdateCategory,
};

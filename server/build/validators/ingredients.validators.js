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
exports.IngredientsValidators = void 0;
const error_model_1 = require("../models/error.model");
const lodash_1 = require("lodash");
const validateCreateIngredient = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, unit } = req.body;
    if (!name) {
        return next(new error_model_1.BadRequestError("name is required"));
    }
    if (!unit || !(0, lodash_1.isString)(unit)) {
        return next(new error_model_1.BadRequestError("unit is required"));
    }
    return next();
});
const validateDeleteIngredient = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    if (!name) {
        return next(new error_model_1.BadRequestError("name is required"));
    }
    return next();
});
const validateUpdateIngredient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, unit } = req.body;
    const ingredientName = req.params.name;
    if (!name && !unit) {
        return next(new error_model_1.BadRequestError("provide updates (name or unit) in body"));
    }
    if (!ingredientName) {
        return next(new error_model_1.BadRequestError("name parameter is missing"));
    }
    return next();
});
exports.IngredientsValidators = {
    validateCreateIngredient,
    validateDeleteIngredient,
    validateUpdateIngredient,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandValidators = void 0;
const error_model_1 = require("../models/error.model");
const validateSetBrand = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        next(new error_model_1.BadRequestError("name is missing"));
    }
    return next();
};
exports.BrandValidators = {
    validateSetBrand,
};

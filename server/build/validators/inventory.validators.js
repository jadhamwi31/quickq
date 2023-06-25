"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryValidator = void 0;
const error_model_1 = require("../models/error.model");
const updateInventoryItemValidator = (req, res, next) => {
    const { available, needed } = req.body;
    const { ingredientName } = req.params;
    if (!available && !needed) {
        next(new error_model_1.BadRequestError("available or needed is required"));
    }
    if (!ingredientName) {
        next(new error_model_1.BadRequestError("ingredient name is required"));
    }
    return next();
};
exports.InventoryValidator = { updateInventoryItemValidator };

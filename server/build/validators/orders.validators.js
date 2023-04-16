"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersValidators = void 0;
const error_model_1 = require("../models/error.model");
const validateNewOrder = (req, res, next) => {
    const { dishes, table_code } = req.body;
    const { table_code: clientTableCode } = req.user;
    if (!table_code && !clientTableCode) {
        return next(new error_model_1.BadRequestError("table code is required"));
    }
    if (dishes.length === 0) {
        return next(new error_model_1.BadRequestError("dishes are required"));
    }
    for (const orderDish of dishes) {
        if (!orderDish.name) {
            return next(new error_model_1.BadRequestError("dish name is missing"));
        }
        if (!orderDish.quantity) {
            orderDish.quantity = 1;
        }
    }
    return next();
};
exports.OrdersValidators = { validateNewOrder };

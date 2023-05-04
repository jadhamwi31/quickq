"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersValidators = void 0;
const error_model_1 = require("../models/error.model");
const validateNewOrder = (req, res, next) => {
    const { dishes, tableId } = req.body;
    const { tableId: clientTableId } = req.user;
    if (!clientTableId && !tableId) {
        return next(new error_model_1.BadRequestError("table id is required"));
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

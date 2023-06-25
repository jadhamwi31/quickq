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
const validateUpdateOrder = (req, res, next) => {
    const { dishesToMutate, dishesToRemove } = req.body;
    const { id } = req.params;
    if (!dishesToMutate && !dishesToRemove) {
        return next(new error_model_1.BadRequestError("invalid order update request"));
    }
    if (dishesToMutate)
        dishesToMutate.forEach((dish) => {
            if (!dish.name) {
                return next(new error_model_1.BadRequestError("dish to mutate : name is missing"));
            }
        });
    if (dishesToRemove)
        dishesToRemove.forEach((dish) => {
            if (!dish.name) {
                return next(new error_model_1.BadRequestError("dish to remove : name is missing"));
            }
        });
    if (!id) {
        return next(new error_model_1.BadRequestError("order id parameter is missing"));
    }
    return next();
};
const validateUpdateOrderStatus = (req, res, next) => {
    const { status } = req.body;
    const { id } = req.params;
    const { role } = req.user;
    if (!status) {
        return next(new error_model_1.BadRequestError("status is missing"));
    }
    if (!(status === "Cancelled" ||
        status === "In Cook" ||
        status === "Pending" ||
        status === "Ready"))
        return next(new error_model_1.BadRequestError("invalid order status"));
    if (role === "client" && status !== "Cancelled") {
        return next(new error_model_1.BadRequestError("you can only cancel orders as client"));
    }
    if (!id) {
        return next(new error_model_1.BadRequestError("order id parameter is missing"));
    }
    return next();
};
exports.OrdersValidators = {
    validateNewOrder,
    validateUpdateOrder,
    validateUpdateOrderStatus,
};

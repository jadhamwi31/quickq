"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidator = void 0;
const error_model_1 = require("../models/error.model");
const validateNewPayment = (req, res, next) => {
    const { tableId, amountPaid } = req.body;
    if (!tableId) {
        return next(new error_model_1.BadRequestError("table id is missing"));
    }
    if (!amountPaid) {
        return next(new error_model_1.BadRequestError("amount is missing"));
    }
    return next();
};
exports.PaymentValidator = {
    validateNewPayment,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidators = void 0;
const error_model_1 = require("../models/error.model");
const validateLogin = (req, _, next) => {
    const { username, password, table_code } = req.body;
    if (table_code) {
        return next();
    }
    if (!username) {
        return next(new error_model_1.BadRequestError("username is required"));
    }
    if (!password) {
        return next(new error_model_1.BadRequestError("password is required"));
    }
    return next();
};
exports.AuthValidators = {
    validateLogin,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersValidators = void 0;
const error_model_1 = require("../models/error.model");
const validateCreateNewUser = (req, res, next) => {
    const { username, password, role } = req.body;
    if (!username) {
        return next(new error_model_1.BadRequestError("username is missing"));
    }
    if (!password) {
        return next(new error_model_1.BadRequestError("password is missing"));
    }
    if (!role) {
        return next(new error_model_1.BadRequestError("role is missing"));
    }
    if (["chef", "cashier", "manager"].indexOf(role) < 0) {
        return next(new error_model_1.BadRequestError("invalid role"));
    }
    return next();
};
const validateDeleteUser = (req, res, next) => {
    const { username } = req.body;
    const { username: _username } = req.user;
    if (!username) {
        return next(new error_model_1.BadRequestError("username is missing"));
    }
    if (_username === username) {
        return next(new error_model_1.ForbiddenError("you can't delete your account"));
    }
    return next();
};
const validateUpdateUser = (req, res, next) => {
    const { username, password, role, oldPassword } = req.body;
    const { username: _username } = req.params;
    const user = req.user;
    if (user.role !== "manager") {
        if (_username) {
            return next(new error_model_1.ForbiddenError("you can't pass username as parameter"));
        }
        if (username) {
            return next(new error_model_1.ForbiddenError("you can't update username"));
        }
        if (role) {
            return next(new error_model_1.ForbiddenError("you can't change roles"));
        }
        if (password && !oldPassword) {
            return next(new error_model_1.BadRequestError("you have to provide old password"));
        }
    }
    else {
        if (!_username && role) {
            return next(new error_model_1.BadRequestError("you can't change your role as manager"));
        }
    }
    return next();
};
exports.UsersValidators = {
    validateCreateNewUser,
    validateDeleteUser,
    validateUpdateUser,
};

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
exports.UsersController = void 0;
const users_service_1 = require("../services/users.service");
const http_status_codes_1 = require("http-status-codes");
const createNewUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        yield users_service_1.UsersService.createNewUser(user);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "user created successfully" });
    }
    catch (e) {
        return next(e);
    }
});
const deleteUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        yield users_service_1.UsersService.deleteUser(username);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "user deleted successfully" });
    }
    catch (e) {
        return next(e);
    }
});
const getUsersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_service_1.UsersService.getUsers();
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, data: users });
    }
    catch (e) {
        return next(e);
    }
});
const updateUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const { username } = req.params;
        const usernameToUpdate = username !== null && username !== void 0 ? username : req.user.username;
        yield users_service_1.UsersService.updateUser(usernameToUpdate, user);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "user updated successfully" });
    }
    catch (e) {
        return next(e);
    }
});
exports.UsersController = {
    createNewUserHandler,
    deleteUserHandler,
    getUsersHandler,
    updateUserHandler,
};

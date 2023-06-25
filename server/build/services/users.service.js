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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const models_1 = require("../models");
const error_model_1 = require("../models/error.model");
const user_model_1 = require("../models/user.model");
const express_http_context_1 = __importDefault(require("express-http-context"));
const createNewUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const usersRepo = models_1.AppDataSource.getRepository(user_model_1.User);
    const userRecord = yield usersRepo.findOneBy({ username: user.username });
    if (userRecord) {
        throw new error_model_1.ConflictError("user already exists");
    }
    yield usersRepo.save(user);
});
const deleteUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const usersRepo = models_1.AppDataSource.getRepository(user_model_1.User);
    const userRecord = yield usersRepo.findOneBy({ username });
    if (!userRecord) {
        throw new error_model_1.NotFoundError("user doesn't exist");
    }
    yield usersRepo.remove(userRecord);
});
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const usersRepo = models_1.AppDataSource.getRepository(user_model_1.User);
    const usersRecords = yield usersRepo.find();
    if (!usersRecords) {
        throw new error_model_1.NotFoundError("user doesn't exist");
    }
    return usersRecords;
});
const updateUser = (_username, { username, password, role, oldPassword, }) => __awaiter(void 0, void 0, void 0, function* () {
    const usersRepo = models_1.AppDataSource.getRepository(user_model_1.User);
    const userRecord = yield usersRepo.findOneBy({ username: _username });
    const userRequestedRole = express_http_context_1.default.get("role");
    if (!userRecord) {
        throw new error_model_1.NotFoundError("user with this username was not found");
    }
    if (username) {
        userRecord.username = username;
    }
    if (password) {
        if (userRequestedRole !== "manager") {
            if (oldPassword === userRecord.password) {
                userRecord.password = password;
            }
            else {
                throw new error_model_1.ForbiddenError("incorrect old password");
            }
        }
        else {
            userRecord.password = password;
        }
    }
    if (role) {
        userRecord.role = role;
    }
    yield usersRepo.update({ username: _username }, userRecord);
});
exports.UsersService = {
    createNewUser,
    deleteUser,
    getUsers,
    updateUser,
};

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
exports.AuthService = void 0;
const models_1 = require("../models");
const error_model_1 = require("../models/error.model");
const user_model_1 = require("../models/user.model");
const jwt_service_1 = require("./jwt.service");
const table_model_1 = require("../models/table.model");
const loginByUsernameAndPassword = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.AppDataSource.getRepository(user_model_1.User).findOneBy({ username });
    if (user) {
        if (user.password === password) {
            const token = jwt_service_1.JwtService.generate({
                username: user.username,
                role: user.role,
            });
            return token;
        }
        else {
            throw new error_model_1.UnauthorizedError("incorrect password");
        }
    }
    else {
        throw new error_model_1.UnauthorizedError("incorrect username");
    }
});
const loginByTableCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const tableCodeRecord = yield models_1.AppDataSource.getRepository(table_model_1.TableCode).findOne({
        where: { code },
        relations: { table: true },
    });
    if (!tableCodeRecord) {
        throw new Error("invalid table code");
    }
    const token = jwt_service_1.JwtService.generate({
        role: "client",
        tableId: tableCodeRecord.table.id,
    });
    return token;
});
exports.AuthService = {
    loginByUsernameAndPassword,
    loginByTableCode,
};

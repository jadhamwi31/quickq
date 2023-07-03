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
exports.UserController = void 0;
const auth_service_1 = require("../services/auth.service");
const http_status_codes_1 = require("http-status-codes");
const loginHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, table_code } = req.body;
    try {
        if (username && password) {
            const { token, role } = yield auth_service_1.AuthService.loginByUsernameAndPassword(username, password);
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .cookie("jwt", token, { httpOnly: false })
                .send({ code: http_status_codes_1.StatusCodes.OK, message: "logged in", token, username, role });
        }
        if (table_code) {
            const { token, role, tableId } = yield auth_service_1.AuthService.loginByTableCode(table_code);
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .cookie("jwt", token, { httpOnly: false })
                .send({ code: http_status_codes_1.StatusCodes.OK, message: "logged in", token, role, tableId });
        }
    }
    catch (e) {
        next(e);
    }
});
const logoutHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return res
        .status(http_status_codes_1.StatusCodes.OK)
        .clearCookie("jwt")
        .send({ code: http_status_codes_1.StatusCodes.OK, message: "logged out" });
});
exports.UserController = {
    loginHandler,
    logoutHandler,
};

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.authFor = void 0;
const jwt_service_1 = require("../services/jwt.service");
const error_model_1 = require("../models/error.model");
const _ = __importStar(require("lodash"));
const tables_service_1 = require("../services/tables.service");
const express_http_context_1 = __importDefault(require("express-http-context"));
const authorizeClient = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = yield tables_service_1.TablesService.getTableSessionClientId(user.tableId);
    if (clientId != user.clientId) {
        throw new error_model_1.ForbiddenError("you're not on this table");
    }
});
const authFor = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authorizationHeader = req.headers["authorization"];
            if (typeof authorizationHeader === "undefined") {
                throw new error_model_1.UnauthorizedError("unauthorized : authorization header not found");
            }
            const token = authorizationHeader.split(" ")[1];
            const user = yield jwt_service_1.JwtService.validate(token);
            if (_.find(roles, (current) => current === user.role)) {
                if (user.role === "client") {
                    if (req.originalUrl !== "/tables/session") {
                        authorizeClient(user);
                    }
                    express_http_context_1.default.set("tableId", user.tableId);
                }
                else {
                    express_http_context_1.default.set("username", user.username);
                }
                express_http_context_1.default.set("role", user.role);
                req.user = user;
                return next();
            }
            else {
                throw new error_model_1.ForbiddenError(`forbidden to access as ${user.role}`);
            }
        }
        catch (e) {
            return next(e);
        }
    });
};
exports.authFor = authFor;

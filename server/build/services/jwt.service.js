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
exports.JwtService = void 0;
const error_model_1 = require("../models/error.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generate = (payload) => {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const token = jsonwebtoken_1.default.sign(JSON.stringify(payload), PRIVATE_KEY);
    return token;
};
const decode = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const PRIVATE_KEY = process.env.PRIVATE_KEY;
        jsonwebtoken_1.default.verify(token, PRIVATE_KEY, (err, user) => {
            if (err)
                reject(new error_model_1.UnauthorizedError(`jwt token failed to verify ${err.message}`));
            resolve(user);
        });
    });
});
exports.JwtService = {
    generate,
    decode,
};

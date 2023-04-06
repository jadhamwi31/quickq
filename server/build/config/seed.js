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
exports.seedDatabase = void 0;
const models_1 = require("../models");
const user_model_1 = require("../models/user.model");
const seeds = require("./seeds.json");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const { users } = seeds;
    const AppDataSource = yield (0, models_1.createAppDataSource)();
    try {
        const usersRecords = yield AppDataSource.getRepository(user_model_1.User).find();
        if (usersRecords.length === 0) {
            AppDataSource.getRepository(user_model_1.User).create(users);
        }
    }
    catch (e) {
        console.log(e);
    }
    finally {
        AppDataSource.destroy();
    }
});
exports.seedDatabase = seedDatabase;
(0, exports.seedDatabase)();

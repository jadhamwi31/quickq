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
exports.createAppDataSource = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
const createAppDataSource = () => __awaiter(void 0, void 0, void 0, function* () {
    const { DB_NAME, DB_HOST, DB_PORT, DB_PASSWORD, DB_USERNAME } = process.env;
    exports.AppDataSource = new typeorm_1.DataSource({
        type: "postgres",
        username: DB_USERNAME,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: Number(DB_PORT),
        database: DB_NAME,
        synchronize: true,
        logging: true,
        entities: [user_model_1.User],
    });
    yield exports.AppDataSource.initialize();
    return exports.AppDataSource;
});
exports.createAppDataSource = createAppDataSource;

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
const dish_model_1 = require("./dish.model");
const ingredient_model_1 = require("./ingredient.model");
const shared_model_1 = require("./shared.model");
const category_model_1 = require("./category.model");
const table_model_1 = require("./table.model");
const order_model_1 = require("./order.model");
const payment_model_1 = require("./payment.model");
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
        entities: [
            user_model_1.User,
            dish_model_1.Dish,
            ingredient_model_1.Ingredient,
            shared_model_1.DishIngredient,
            category_model_1.Category,
            table_model_1.Table,
            shared_model_1.OrderDish,
            order_model_1.Order,
            payment_model_1.Payment,
            table_model_1.TableCode,
        ],
    });
    yield exports.AppDataSource.initialize();
    return exports.AppDataSource;
});
exports.createAppDataSource = createAppDataSource;

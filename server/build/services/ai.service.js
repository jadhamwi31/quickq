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
exports.AiService = void 0;
const models_1 = require("../models");
const payment_model_1 = require("../models/payment.model");
const moment_1 = __importDefault(require("moment"));
const dish_model_1 = require("../models/dish.model");
const json2csv_1 = require("json2csv");
const axios_1 = __importDefault(require("axios"));
const dishes_service_1 = require("./dishes.service");
const dateFormat = "YYYY-MM-DD";
const getDishesSalesData = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield models_1.AppDataSource.getRepository(payment_model_1.Payment).find();
    const dates = [...new Set(payments.filter((payment) => payment.date).map((payment) => ((0, moment_1.default)(payment.date).format(dateFormat))))];
    const dishes = yield models_1.AppDataSource.getRepository(dish_model_1.Dish).find({ relations: { orderDishes: true } });
    const data = {};
    console.log(dates);
    for (const date of dates) {
        data[date] = [];
        for (const dish of dishes) {
            const dishInOrders = dish.orderDishes;
            let count = 0;
            let price = -1;
            for (const dishInOrder of dishInOrders) {
                console.log("dish in order", dishInOrder);
                if ((0, moment_1.default)(dishInOrder.date).format(dateFormat) === date) {
                    count += dishInOrder.quantity;
                    price = dishInOrder.price;
                }
            }
            data[date].push({ item_id: dish.id, item_count: count, date, price: price === -1 ? dish.price : price });
        }
    }
    const dataFlattened = Object.values(data).flat();
    console.log(dataFlattened);
    const parser = new json2csv_1.Parser({ fields: ["date", "item_id", "price", "item_count"], header: true });
    return parser.parse(dataFlattened);
});
const predictPrices = (csv) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const predictedPrices = (yield axios_1.default.post("http://0.0.0.0:5000/predictions/prices", csv).then(({ data }) => {
            return data;
        }));
        const predictedPricesReformed = [];
        for (const entry of predictedPrices) {
            try {
                const dish = yield dishes_service_1.DishesService.getDishById(entry.item_id);
                predictedPricesReformed.push({
                    actual_price: entry.Actual,
                    recommended_price: entry.Predicted,
                    dish_name: dish.name
                });
            }
            catch (e) {
                predictedPricesReformed.push({
                    actual_price: entry.Actual,
                    recommended_price: entry.Predicted,
                    dish_name: "unknown"
                });
            }
        }
        return predictedPricesReformed;
    }
    catch (e) {
        return [];
    }
});
const getPricesPrediction = () => __awaiter(void 0, void 0, void 0, function* () {
    const pricesTestData = yield getDishesSalesData();
    return yield predictPrices(pricesTestData);
});
exports.AiService = {
    getPricesPrediction,
};

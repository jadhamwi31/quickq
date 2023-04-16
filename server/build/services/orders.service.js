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
exports.OrdersService = void 0;
const models_1 = require("../models");
const dish_model_1 = require("../models/dish.model");
const error_model_1 = require("../models/error.model");
const order_model_1 = require("../models/order.model");
const payment_model_1 = require("../models/payment.model");
const shared_model_1 = require("../models/shared.model");
const table_model_1 = require("../models/table.model");
const createNewOrder = (newOrder, tableId) => __awaiter(void 0, void 0, void 0, function* () {
    const dishesRepo = models_1.AppDataSource.getRepository(dish_model_1.Dish);
    const tablesRepo = models_1.AppDataSource.getRepository(table_model_1.Table);
    const ordersRepo = models_1.AppDataSource.getRepository(order_model_1.Order);
    const paymentsRepo = models_1.AppDataSource.getRepository(payment_model_1.Payment);
    const ordersDishesRepo = models_1.AppDataSource.getRepository(shared_model_1.OrderDish);
    const tableRecord = yield tablesRepo.findOneBy({ id: tableId });
    if (!tableRecord) {
        throw new error_model_1.NotFoundError(`table with id ${tableId} doesn't exist`);
    }
    const order = new order_model_1.Order();
    const payment = new payment_model_1.Payment();
    yield paymentsRepo.insert(payment);
    order.payment = payment;
    order.table = tableRecord;
    order.orderDishes = [];
    order.status = "Pending";
    order.total = 0;
    order.orderDishes = [];
    for (const orderDish of newOrder) {
        const dishRecord = yield dishesRepo.findOneBy({ name: orderDish.name });
        if (!dishRecord) {
            throw new error_model_1.NotFoundError(`${orderDish.name}: not found`);
        }
        order.total += dishRecord.price * orderDish.quantity;
        const newOrderDish = new shared_model_1.OrderDish();
        newOrderDish.order = order;
        newOrderDish.dish = dishRecord;
        newOrderDish.quantity = orderDish.quantity;
        yield ordersDishesRepo.insert(newOrderDish);
        order.orderDishes.push(newOrderDish);
    }
    yield ordersRepo.insert(order);
});
exports.OrdersService = {
    createNewOrder,
};

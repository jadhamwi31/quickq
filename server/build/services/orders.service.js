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
exports.OrdersService = void 0;
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
const dish_model_1 = require("../models/dish.model");
const error_model_1 = require("../models/error.model");
const order_model_1 = require("../models/order.model");
const payment_model_1 = require("../models/payment.model");
const shared_model_1 = require("../models/shared.model");
const table_model_1 = require("../models/table.model");
const redis_service_1 = __importDefault(require("./redis.service"));
const tables_service_1 = require("./tables.service");
const websocket_service_1 = __importDefault(require("./websocket.service"));
const lodash_1 = require("lodash");
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
    if (tableRecord.status === "Available") {
        throw new error_model_1.BadRequestError("open table before start ordering");
    }
    const clientId = yield tables_service_1.TablesService.getTableSessionClientId(tableId);
    const order = new order_model_1.Order();
    const payment = yield paymentsRepo.findOneBy({
        clientId,
    });
    order.payment = payment;
    order.table = tableRecord;
    order.orderDishes = [];
    order.status = "Pending";
    order.total = 0;
    order.orderDishes = [];
    yield ordersRepo.save(order);
    for (const orderDish of newOrder) {
        const dishRecord = yield dishesRepo.findOneBy({ name: orderDish.name });
        if (!dishRecord) {
            throw new error_model_1.NotFoundError(`${orderDish.name}: not found`);
        }
        order.total += Number(dishRecord.price) * orderDish.quantity;
        const newOrderDish = new shared_model_1.OrderDish();
        newOrderDish.order = order;
        newOrderDish.dish = dishRecord;
        newOrderDish.quantity = orderDish.quantity;
        newOrderDish.price = dishRecord.price;
        yield ordersDishesRepo.save(newOrderDish);
        order.orderDishes.push(newOrderDish);
    }
    yield ordersRepo.save(order);
    const redisTableOrder = {
        id: order.id,
        tableId: tableRecord.id,
        total: order.total,
        date: order.date.toString(),
        dishes: order.orderDishes.map((orderDish) => ({
            id: orderDish.dish.id,
            name: orderDish.dish.name,
            quantity: orderDish.quantity,
            price: orderDish.dish.price,
        })),
        status: "Pending",
    };
    // Update Orders In Cache
    yield redis_service_1.default.redis.hset("orders", String(redisTableOrder.id), JSON.stringify(redisTableOrder));
    yield websocket_service_1.default.publishEvent(["cashier", "chef"], "new_order", redisTableOrder);
    yield websocket_service_1.default.publishEvent(["cashier", "chef"], "notification", "New Order", `New Order | ID : ${redisTableOrder.id} | Table : ${redisTableOrder.tableId}`);
});
const orderBelongsToTable = (orderId, tableId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield getTodayOrders();
    const order = orders.find((order) => order.id == orderId);
    if (order) {
        if (order.tableId == tableId) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        throw new error_model_1.NotFoundError("order with this id was not found");
    }
});
const updateOrder = (orderId, dishesToMutate, dishesToRemove) => __awaiter(void 0, void 0, void 0, function* () {
    const ordersRepo = models_1.AppDataSource.getRepository(order_model_1.Order);
    const orderRecord = yield ordersRepo.findOneBy({ id: orderId });
    if (!orderRecord) {
        throw new error_model_1.NotFoundError("order with this id doesn't exist");
    }
    const ordersDishesRepo = models_1.AppDataSource.getRepository(shared_model_1.OrderDish);
    const dishesRepo = models_1.AppDataSource.getRepository(dish_model_1.Dish);
    const orderDishesRecords = yield ordersDishesRepo.find({
        relations: { dish: true, order: true },
        where: { order: { id: orderId } },
    });
    if (dishesToMutate)
        for (const dish of dishesToMutate) {
            const dishRecord = yield dishesRepo.findOneBy({ name: dish.name });
            if (!dishRecord) {
                throw new error_model_1.NotFoundError(`dish ${dish.name} not found`);
            }
            const index = orderDishesRecords.findIndex((current) => current.dish.name === dish.name);
            if (index >= 0) {
                orderDishesRecords[index].quantity = dish.quantity;
            }
            else {
                throw new error_model_1.BadRequestError(`you didn't order ${dish.name}`);
            }
        }
    if (dishesToRemove)
        for (const dish of dishesToRemove) {
            const index = orderDishesRecords.findIndex((current) => current.dish.name === dish.name);
            if (index >= 0) {
                orderDishesRecords.splice(index, 1);
            }
            else {
                throw new error_model_1.BadRequestError(`you didn't order ${dish.name}`);
            }
        }
    yield ordersDishesRepo.save(orderDishesRecords);
    const orders = yield getTodayOrders();
    const currentOrder = orders.find((order) => order.id == orderId);
    if (dishesToMutate || dishesToRemove) {
        websocket_service_1.default.publishEvent(["chef", "manager", String(orderRecord.table.id), "cashier"], "update_order", orderId, { dishesToMutate, dishesToRemove });
        const MutatedDishesStr = dishesToMutate.map((dish) => `${dish.name} : ${dish.quantity}`).join("\n");
        const RemovedDishesStr = dishesToRemove.map((dish) => `${dish.name}`).join("\n");
        websocket_service_1.default.publishEvent(["chef"], "notification", "Order Update", `Dishes Modified :\n${MutatedDishesStr}\nDishes Removed :\n${RemovedDishesStr}`);
    }
    currentOrder.dishes = orderDishesRecords.map((orderDish) => ({
        id: orderDish.id,
        quantity: orderDish.quantity,
        name: orderDish.dish.name,
        price: orderDish.dish.price,
    }));
    // Update Order In Cache
    yield redis_service_1.default.redis.hset("orders", String(orderId), JSON.stringify(currentOrder));
});
const updateOrderStatus = (orderId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const ordersRepo = models_1.AppDataSource.getRepository(order_model_1.Order);
    const orderRecord = yield ordersRepo.findOne({
        where: { id: orderId },
        relations: { table: true },
    });
    if (!orderRecord) {
        throw new error_model_1.NotFoundError("order with this id doesn't exist");
    }
    if (orderRecord.status !== "Pending" && status === "Cancelled") {
        throw new error_model_1.BadRequestError("you can cancel only a pending order");
    }
    orderRecord.status = status;
    websocket_service_1.default.publishEvent([String(orderRecord.table.id), "manager", "cashier", "chef"], "update_order_status", orderRecord.id, status);
    websocket_service_1.default.publishEvent([String(orderRecord.table.id), "manager", "cashier", "chef"], "notification", "Order Status Update", `Order : ${orderRecord.id} | ${orderRecord.status}`);
    yield ordersRepo.save(orderRecord);
    // Update Order Status In Cache
    const isOrderCached = yield redis_service_1.default.isCached("orders", String(orderId));
    if (isOrderCached) {
        redis_service_1.default.cacheLog("orders", String(orderId));
        const newRedisOrder = JSON.parse(yield redis_service_1.default.redis.hget("orders", String(orderId)));
        newRedisOrder.status = status;
        yield redis_service_1.default.redis.hset("orders", String(orderId), JSON.stringify(newRedisOrder));
    }
    else {
        const orders = yield getTodayOrders();
        const currentOrder = orders.find((order) => order.id == orderId);
        currentOrder.status = status;
        yield redis_service_1.default.redis.hset("orders", String(orderId), JSON.stringify(currentOrder));
    }
});
const getTodayOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const areOrdersCached = yield redis_service_1.default.isCached("orders");
    if (areOrdersCached) {
        redis_service_1.default.cacheLog("orders");
        const _todayOrders = Object.values(yield redis_service_1.default.redis.hgetall("orders")).map((order) => JSON.parse(order));
        const _todayOrdersSorted = _todayOrders.sort((a, b) => b.id - a.id);
        return _todayOrdersSorted;
    }
    else {
        const dayStart = (0, moment_1.default)().startOf("day").toDate();
        const dayEnd = (0, moment_1.default)().endOf("day").toDate();
        const _orders = yield models_1.AppDataSource.createQueryBuilder()
            .from(order_model_1.Order, "order")
            .addSelect(["order.id", "order.status", "order.date"])
            .leftJoin("order.table", "table")
            .addSelect(["table.id"])
            .leftJoin("order.orderDishes", "order_dish")
            .addSelect(["order_dish.quantity"])
            .leftJoin("order_dish.dish", "dish")
            .addSelect(["dish.name", "dish.price"])
            .where({ date: (0, typeorm_1.Between)(dayStart, dayEnd) })
            .orderBy("order.date", "DESC")
            .getMany();
        const orders = [];
        const redisOrdersToSet = {};
        // Transform Orders To Redis Order Structure
        for (const order of _orders) {
            const orderObject = {
                id: order.id,
                tableId: order.table.id,
                status: order.status,
                total: order.total,
                date: order.date.toString(),
                dishes: order.orderDishes.map((orderDish) => ({
                    name: orderDish.dish.name,
                    quantity: orderDish.quantity,
                    price: orderDish.dish.price,
                    id: orderDish.dish.id,
                })),
            };
            orders.push(orderObject);
            redisOrdersToSet[order.id] = JSON.stringify(orderObject);
        }
        if (!(0, lodash_1.isEmpty)(redisOrdersToSet)) {
            // Update Orders In Redis
            yield redis_service_1.default.redis.hmset("orders", redisOrdersToSet);
        }
        return orders;
    }
});
const getOrdersHistory = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield models_1.AppDataSource.createQueryBuilder()
        .from(order_model_1.Order, "order")
        .addSelect(["order.date", "order.total", "order.id"])
        .leftJoin("order.orderDishes", "order_dish")
        .addSelect(["order_dish.quantity"])
        .leftJoin("order_dish.dish", "dish")
        .addSelect(["dish.name", "dish.price", "dish.description"])
        .leftJoin("dish.category", "category")
        .addSelect(["category.name"])
        .leftJoin("dish.dishIngredients", "dish_ingredient")
        .addSelect(["dish_ingredient.amount"])
        .leftJoin("dish_ingredient.ingredient", "ingredient")
        .addSelect(["ingredient.name"])
        .orderBy("order.date", "DESC")
        .getMany();
    return orders;
});
const getTableOrders = (tableId) => __awaiter(void 0, void 0, void 0, function* () {
    const todayOrders = yield getTodayOrders();
    return todayOrders.filter((order) => order.tableId == tableId);
});
exports.OrdersService = {
    createNewOrder,
    orderBelongsToTable,
    updateOrder,
    updateOrderStatus,
    getTodayOrders,
    getOrdersHistory, getTableOrders
};

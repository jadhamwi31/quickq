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
exports.PaymentService = void 0;
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
const error_model_1 = require("../models/error.model");
const payment_model_1 = require("../models/payment.model");
const table_model_1 = require("../models/table.model");
const redis_service_1 = __importDefault(require("./redis.service"));
const tables_service_1 = require("./tables.service");
const websocket_service_1 = __importDefault(require("./websocket.service"));
const orders_service_1 = require("./orders.service");
const newPayment = (tableId, amountPaid) => __awaiter(void 0, void 0, void 0, function* () {
    const { total } = yield tables_service_1.TablesService.checkoutTable(tableId);
    const clientId = yield tables_service_1.TablesService.getTableSessionClientId(tableId);
    const tablesRepo = models_1.AppDataSource.getRepository(table_model_1.Table);
    if (total !== amountPaid) {
        throw new error_model_1.ForbiddenError(`amount paid not equel to check total ${total}`);
    }
    const { receipt } = yield tables_service_1.TablesService.checkoutTable(tableId);
    receipt.forEach((tableOrder) => {
        if (tableOrder.status !== "Ready") {
            throw new error_model_1.BadRequestError("pending/in-cook orders still present");
        }
    });
    const paymentsRepo = models_1.AppDataSource.getRepository(payment_model_1.Payment);
    const payment = yield paymentsRepo.findOneBy({ clientId });
    if (payment) {
        payment.date = new Date();
        payment.amount = amountPaid;
        yield paymentsRepo.save(payment);
    }
    else {
        throw new error_model_1.BadRequestError("no payment for this table right now");
    }
    const tablesSessionsRepo = models_1.AppDataSource.getRepository(table_model_1.TableSession);
    const tableSessionRecord = yield tablesSessionsRepo.findOne({
        relations: { table: true },
        where: { table: { id: tableId } },
    });
    tableSessionRecord.clientId = null;
    yield tablesSessionsRepo.save(tableSessionRecord);
    // Clear Table Session From Cache
    yield redis_service_1.default.redis.hdel("tables:sessions", String(tableId));
    // Table Orders
    const redisTablesOrders = yield orders_service_1.OrdersService.getTodayOrders();
    // Clear Table Orders From Cache
    for (const order of redisTablesOrders) {
        if (order.tableId == tableId) {
            yield redis_service_1.default.redis.hdel("orders", String(order.id));
        }
    }
    // Previous Cache Values
    const prevTransactions = JSON.parse(yield redis_service_1.default.redis.hget("payments", "transactions"));
    const prevPayins = yield redis_service_1.default.redis.hget("payments", "payins");
    // Update Trasanctions In Cache
    yield redis_service_1.default.redis.hset("payments", "transactions", JSON.stringify([
        ...prevTransactions,
        {
            date: payment.date.toString(),
            amount: payment.amount,
            tableId,
        },
    ]));
    // Update Payins In Cache
    yield redis_service_1.default.redis.hset("payments", "payins", Number(prevPayins) + payment.amount);
    // Update Table Status
    const tableRecord = yield tablesRepo.findOneBy({ id: tableId });
    tableRecord.status = "Available";
    yield tablesRepo.save(tableRecord);
    websocket_service_1.default.publishEvent(["manager", "cashier", "chef"], "notification", `Table Status Update | Table Number : ${tableId}`, `Available`);
    websocket_service_1.default.publishEvent(["manager", "chef", "cashier"], "update_table_status", tableRecord.id, "Available");
    websocket_service_1.default.publishEvent(["manager", "chef", "cashier"], "increment_payins", amountPaid);
});
const getPaymentsHistory = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.AppDataSource.createQueryBuilder()
        .from(payment_model_1.Payment, "payment")
        .addSelect(["payment.date", "payment.amount"])
        .leftJoin("payment.orders", "order")
        .getMany();
});
const getTodayPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    const arePaymentsCached = yield redis_service_1.default.isCached("payments");
    if (arePaymentsCached) {
        redis_service_1.default.cacheLog("payments");
        const transactions = JSON.parse(yield redis_service_1.default.getCachedVersion("payments", "transactions"));
        const payins = Number(yield redis_service_1.default.getCachedVersion("payments", "payins"));
        return {
            transactions,
            payins,
        };
    }
    else {
        const dayStart = (0, moment_1.default)().startOf("day").toDate();
        const dayEnd = (0, moment_1.default)().endOf("day").toDate();
        const transactions = yield models_1.AppDataSource.getRepository(payment_model_1.Payment).find({
            where: { date: (0, typeorm_1.Between)(dayStart, dayEnd) },
            select: ["date", "amount", "clientId"],
        });
        const payins = transactions.reduce((prev, current) => prev + current.amount, 0);
        // Update Payments in Cache
        yield redis_service_1.default.redis.hset("payments", "transactions", JSON.stringify(transactions));
        yield redis_service_1.default.redis.hset("payments", "payins", payins);
        return {
            transactions,
            payins,
        };
    }
});
exports.PaymentService = {
    newPayment,
    getPaymentsHistory,
    getTodayPayments,
};

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
    const clientId = yield tables_service_1.TablesService.getTableSessionClientId(tableId);
    const tablesRepo = models_1.AppDataSource.getRepository(table_model_1.Table);
    const table = yield tablesRepo.findOneBy({ id: tableId });
    const { total, receipt } = yield tables_service_1.TablesService.checkoutTable(tableId);
    if (total !== amountPaid) {
        throw new error_model_1.ForbiddenError(`amount paid not equel to check total ${total}`);
    }
    receipt.forEach((tableOrder) => {
        if (tableOrder.status === "Pending" || tableOrder.status === "In Cook") {
            throw new error_model_1.BadRequestError("pending/in-cook orders still present");
        }
    });
    const paymentsRepo = models_1.AppDataSource.getRepository(payment_model_1.Payment);
    const payment = yield paymentsRepo.findOneBy({ clientId });
    if (payment) {
        payment.date = new Date();
        payment.amount = amountPaid;
        payment.table = table;
        yield paymentsRepo.save(payment);
    }
    else {
        throw new error_model_1.BadRequestError("no payment for this table right now");
    }
    yield tables_service_1.TablesService.closeTableSession(tableId, true);
    const tableOrders = yield orders_service_1.OrdersService.getTableOrders(tableId);
    // Clear Table Orders From Cache
    for (const order of tableOrders) {
        yield redis_service_1.default.redis.hdel("orders", String(order.id));
    }
    // Previous Cache Values
    const areTransactionsCached = yield redis_service_1.default.isCached("payments", "transactions");
    const prevTransactions = JSON.parse(yield redis_service_1.default.redis.hget("payments", "transactions"));
    const prevPayins = yield redis_service_1.default.redis.hget("payments", "payins");
    if (areTransactionsCached) {
        yield redis_service_1.default.redis.hset("payments", "transactions", JSON.stringify([
            ...prevTransactions,
            {
                date: payment.date.toString(),
                amount: payment.amount,
                tableId: Number(tableId),
            },
        ]));
    }
    else {
        yield redis_service_1.default.redis.hset("payments", "transactions", JSON.stringify([
            {
                date: payment.date.toString(),
                amount: payment.amount,
                tableId: Number(tableId),
            },
        ]));
    }
    // Update Payins In Cache
    yield redis_service_1.default.redis.hset("payments", "payins", Number(prevPayins) + payment.amount);
    // Update Table Status
    const tableRecord = yield tablesRepo.findOneBy({ id: tableId });
    tableRecord.status = "Available";
    yield tablesRepo.save(tableRecord);
    websocket_service_1.default.publishEvent(["manager", "cashier", "chef"], "notification", `Table Status Update | Table Number : ${tableId}`, `Available`);
    websocket_service_1.default.publishEvent(["manager", "chef", "cashier"], "update_table_status", tableRecord.id, "Available");
    websocket_service_1.default.publishEvent(["manager", "cashier"], "increment_payins", amountPaid);
    console.log({
        amount: payment.amount,
        tableId: payment.table.id,
        date: payment.date.toString(),
        clientId: payment.clientId
    });
    websocket_service_1.default.publishEvent(["manager", "cashier"], "new_payment", {
        amount: payment.amount,
        tableId: payment.table.id,
        date: payment.date.toString(),
        clientId: payment.clientId
    });
});
const getPaymentsHistory = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield models_1.AppDataSource.createQueryBuilder()
        .from(payment_model_1.Payment, "payment")
        .addSelect(["payment.date", "payment.amount"])
        .leftJoin("payment.orders", "order")
        .getMany();
    return { payments: payments.map((payment) => (Object.assign(Object.assign({}, payment), { date: (0, moment_1.default)(payment.date).format("DD/MM/YYYY") }))), total: payments.reduce((total, current) => total + current.amount, 0) };
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
        const _transactions = yield models_1.AppDataSource.getRepository(payment_model_1.Payment).find({
            where: { date: (0, typeorm_1.Between)(dayStart, dayEnd), amount: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) }, relations: { table: true },
            select: ["date", "amount", "clientId", "table"],
        });
        console.log(_transactions);
        const transactions = _transactions.map((transaction) => {
            const tableId = transaction.table.id;
            delete transaction.table;
            return Object.assign(Object.assign({}, transaction), { tableId });
        });
        console.log(transactions);
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

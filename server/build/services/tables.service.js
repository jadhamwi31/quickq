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
exports.TablesService = void 0;
const uuid_1 = require("uuid");
const models_1 = require("../models");
const error_model_1 = require("../models/error.model");
const payment_model_1 = require("../models/payment.model");
const table_model_1 = require("../models/table.model");
const redis_service_1 = __importDefault(require("./redis.service"));
const orders_service_1 = require("./orders.service");
const websocket_service_1 = __importDefault(require("./websocket.service"));
const getTableSessionClientId = (tableId) => __awaiter(void 0, void 0, void 0, function* () {
    const isTableSessionCached = yield redis_service_1.default.isCached("tables:sessions", String(tableId));
    if (isTableSessionCached) {
        const clientId = yield redis_service_1.default.getCachedVersion("tables:sessions", String(tableId));
        return clientId;
    }
    else {
        const tableSession = yield models_1.AppDataSource.getRepository(table_model_1.TableSession).findOne({
            relations: { table: true },
            where: { table: { id: tableId } },
        });
        if (tableSession.clientId) {
            yield redis_service_1.default.redis.hset("tables:sessions", String(tableId), tableSession.clientId);
            return tableSession.clientId;
        }
        throw new error_model_1.BadRequestError("open table session first");
    }
});
const createNewTable = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tablesRepo = models_1.AppDataSource.getRepository(table_model_1.Table);
    const tablesCodesRepo = models_1.AppDataSource.getRepository(table_model_1.TableCode);
    const tablesSessionsRepo = models_1.AppDataSource.getRepository(table_model_1.TableSession);
    const tableExists = yield tablesRepo.findOneBy({ id });
    if (tableExists) {
        throw new error_model_1.ConflictError("table with this id already exists");
    }
    const tableRecord = new table_model_1.Table();
    const tableCodeRecord = new table_model_1.TableCode();
    const tableSession = new table_model_1.TableSession();
    try {
        tableRecord.id = id;
        tableRecord.status = "Available";
        yield tablesRepo.save(tableRecord);
        tableCodeRecord.code = (0, uuid_1.v4)();
        tableCodeRecord.table = tableRecord;
        yield tablesCodesRepo.save(tableCodeRecord);
        tableSession.table = tableRecord;
        yield tablesSessionsRepo.save(tableSession);
        return tableCodeRecord.code;
    }
    catch (e) {
        yield tablesRepo.remove(tableRecord);
        yield tablesCodesRepo.remove(tableCodeRecord);
        yield tablesSessionsRepo.remove(tableSession);
    }
});
const deleteTable = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tablesRepo = models_1.AppDataSource.getRepository(table_model_1.Table);
    const tableRecord = yield tablesRepo.findOneBy({ id });
    if (!tableRecord) {
        throw new error_model_1.NotFoundError("table with this id doesn't exist");
    }
    yield tablesRepo.remove(tableRecord);
});
const getTables = (role) => __awaiter(void 0, void 0, void 0, function* () {
    const tablesCodesRepo = models_1.AppDataSource.getRepository(table_model_1.TableCode);
    const tablesCodes = yield tablesCodesRepo.find({
        relations: { table: true },
        select: ["table", "code"],
    });
    return tablesCodes.map((tableCode) => ({
        code: role === "manager" ? tableCode.code : undefined,
        id: tableCode.table.id,
        status: tableCode.table.status,
    }));
});
const openNewTableSession = (tableId, clientId) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentsRepo = models_1.AppDataSource.getRepository(payment_model_1.Payment);
    const tablesRepo = models_1.AppDataSource.getRepository(table_model_1.Table);
    const table = yield tablesRepo.findOneBy({ id: tableId });
    const prevStatus = table.status;
    if (table.status === "Busy") {
        throw new error_model_1.BadRequestError("table is busy");
    }
    const payment = new payment_model_1.Payment();
    table.status = "Busy";
    payment.clientId = clientId;
    yield paymentsRepo.save(payment);
    yield tablesRepo.save(table);
    const tablesSessionsRepo = models_1.AppDataSource.getRepository(table_model_1.TableSession);
    const tableSessionRecord = yield tablesSessionsRepo.findOne({
        relations: { table: true },
        where: { table: { id: tableId } },
    });
    tableSessionRecord.clientId = clientId;
    yield tablesSessionsRepo.save(tableSessionRecord);
    yield redis_service_1.default.redis.hset("tables:sessions", String(tableId), clientId);
    if (prevStatus === "Available") {
        websocket_service_1.default.publishEvent(["manager", "cashier", "chef"], "update_table_status", Number(tableId), "Busy");
        websocket_service_1.default.publishEvent(["manager", "cashier", "chef"], "notification", `Table Status Update | Table Number : ${tableId}`, "Busy");
    }
});
const closeTableSession = (tableId, fromPayment = false) => __awaiter(void 0, void 0, void 0, function* () {
    const tablesRepo = models_1.AppDataSource.getRepository(table_model_1.Table);
    const table = yield tablesRepo.findOneBy({ id: tableId });
    const prevStatus = table.status;
    const clientOrders = yield orders_service_1.OrdersService.getTableOrders(tableId);
    if (!fromPayment && clientOrders.length !== 0) {
        throw new error_model_1.BadRequestError("table has to pay before closing");
    }
    table.status = "Available";
    yield tablesRepo.save(table);
    const tablesSessionsRepo = models_1.AppDataSource.getRepository(table_model_1.TableSession);
    const tableSessionRecord = yield tablesSessionsRepo.findOne({
        relations: { table: true },
        where: { table: { id: tableId } },
    });
    tableSessionRecord.clientId = null;
    yield tablesSessionsRepo.save(tableSessionRecord);
    yield redis_service_1.default.redis.hdel("tables:sessions", String(tableId));
    if (prevStatus === "Busy") {
        websocket_service_1.default.publishEvent(["manager", "cashier", "chef"], "update_table_status", Number(tableId), "Available");
        websocket_service_1.default.publishEvent(["manager", "cashier", "chef"], "notification", `Table Status Update | Table Number : ${tableId}`, "Available");
    }
});
const checkoutTable = (tableId) => __awaiter(void 0, void 0, void 0, function* () {
    const tableOrders = (yield orders_service_1.OrdersService.getTableOrders(tableId)).filter((order) => order.status !== "Cancelled");
    const total = tableOrders.reduce((total, current) => total + current.total, 0);
    console.log(tableOrders, total);
    return { receipt: tableOrders, total };
});
exports.TablesService = {
    createNewTable,
    deleteTable,
    getTables,
    openNewTableSession,
    checkoutTable,
    getTableSessionClientId,
    closeTableSession,
};

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
const models_1 = require("../models");
const error_model_1 = require("../models/error.model");
const table_model_1 = require("../models/table.model");
const uuid_1 = require("uuid");
const redis_service_1 = __importDefault(require("./redis.service"));
const payment_model_1 = require("../models/payment.model");
const createNewTable = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tablesRepo = models_1.AppDataSource.getRepository(table_model_1.Table);
    const tablesCodesRepo = models_1.AppDataSource.getRepository(table_model_1.TableCode);
    const tableExists = yield tablesRepo.findOneBy({ id });
    if (tableExists) {
        throw new error_model_1.ConflictError("table with this id already exists");
    }
    const tableRecord = new table_model_1.Table();
    const tableCodeRecord = new table_model_1.TableCode();
    try {
        tableRecord.id = id;
        tableRecord.status = "Available";
        yield tablesRepo.insert(tableRecord);
        tableCodeRecord.code = (0, uuid_1.v4)();
        tableCodeRecord.table = tableRecord;
        yield tablesCodesRepo.insert(tableCodeRecord);
        return tableCodeRecord.code;
    }
    catch (e) {
        tablesRepo.remove(tableRecord);
        tablesCodesRepo.remove(tableCodeRecord);
    }
});
const updateTable = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const tablesRepo = models_1.AppDataSource.getRepository(table_model_1.Table);
    const tableRecord = yield tablesRepo.findOneBy({ id });
    if (!tableRecord) {
        throw new error_model_1.NotFoundError("table with this id doesn't exist");
    }
    tableRecord.status = status;
    yield tablesRepo.save(tableRecord);
});
const deleteTable = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tablesRepo = models_1.AppDataSource.getRepository(table_model_1.Table);
    const tableRecord = yield tablesRepo.findOneBy({ id });
    if (!tableRecord) {
        throw new error_model_1.NotFoundError("table with this id doesn't exist");
    }
    yield tablesRepo.delete(tableRecord);
});
const getTables = () => __awaiter(void 0, void 0, void 0, function* () {
    const tablesCodesRepo = models_1.AppDataSource.getRepository(table_model_1.TableCode);
    const tablesCodes = yield tablesCodesRepo.find({
        relations: { table: true },
        select: ["table", "code"],
    });
    return tablesCodes.map((tableCode) => ({
        code: tableCode.code,
        id: tableCode.table.id,
        status: tableCode.table.status,
    }));
});
const openTable = (tableId) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentsRepo = models_1.AppDataSource.getRepository(payment_model_1.Payment);
    const paymentId = (0, uuid_1.v4)();
    const payment = new payment_model_1.Payment();
    payment.id = paymentId;
    paymentsRepo.insert(payment);
    redis_service_1.default.redis.hset("tables", String(tableId), JSON.stringify({
        paymentId,
        status: "Busy",
    }));
    redis_service_1.default.redis.publish("tables_statuses", JSON.stringify({
        tableId,
        status: "Busy",
    }));
});
exports.TablesService = {
    createNewTable,
    updateTable,
    deleteTable,
    getTables,
    openTable,
};

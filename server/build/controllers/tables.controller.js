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
exports.TablesController = void 0;
const tables_service_1 = require("../services/tables.service");
const http_status_codes_1 = require("http-status-codes");
const newTableHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const tableCode = yield tables_service_1.TablesService.createNewTable(id);
        return res.status(http_status_codes_1.StatusCodes.OK).send({
            code: http_status_codes_1.StatusCodes.OK,
            message: "table added",
            data: { table_code: tableCode },
        });
    }
    catch (e) {
        next(e);
    }
});
const updateTableHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        yield tables_service_1.TablesService.updateTable(id, status);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "table updated" });
    }
    catch (e) {
        next(e);
    }
});
const deleteTableHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield tables_service_1.TablesService.deleteTable(id);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "table deleted" });
    }
    catch (e) {
        next(e);
    }
});
const getTablesHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tables = yield tables_service_1.TablesService.getTables();
        return res.status(http_status_codes_1.StatusCodes.OK).send(tables);
    }
    catch (e) {
        next(e);
    }
});
exports.TablesController = {
    newTableHandler,
    updateTableHandler,
    deleteTableHandler,
    getTablesHandler,
};

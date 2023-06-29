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
exports.OrdersController = void 0;
const orders_service_1 = require("../services/orders.service");
const http_status_codes_1 = require("http-status-codes");
const error_model_1 = require("../models/error.model");
const newOrderHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { dishes, tableId } = req.body;
    const { tableId: clientTableId } = req.user;
    try {
        yield orders_service_1.OrdersService.createNewOrder(dishes, tableId !== null && tableId !== void 0 ? tableId : clientTableId);
        return res.status(http_status_codes_1.StatusCodes.OK).send({
            code: http_status_codes_1.StatusCodes.OK,
            message: `order added to table ${tableId || clientTableId}`,
        });
    }
    catch (e) {
        next(e);
    }
});
const updateOrderHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.user;
    const { id } = req.params;
    const { dishesToMutate, dishesToRemove } = req.body;
    try {
        if (role === "client" &&
            !orders_service_1.OrdersService.orderBelongsToTable(id, req.user.tableId)) {
            throw new error_model_1.ForbiddenError("order should belong to your table");
        }
        yield orders_service_1.OrdersService.updateOrder(id, dishesToMutate, dishesToRemove);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ message: "order updated successfully", code: http_status_codes_1.StatusCodes.OK });
    }
    catch (e) {
        return next(e);
    }
});
const updateOrderStatusHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const { role } = req.user;
    try {
        if (role === "client" &&
            !orders_service_1.OrdersService.orderBelongsToTable(id, req.user.tableId)) {
            throw new error_model_1.ForbiddenError("order should belong to your table");
        }
        yield orders_service_1.OrdersService.updateOrderStatus(id, status);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ message: "order updated successfully", code: http_status_codes_1.StatusCodes.OK });
    }
    catch (e) {
        return next(e);
    }
});
const getTodayOrdersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orders_service_1.OrdersService.getTodayOrders();
        return res.status(http_status_codes_1.StatusCodes.OK).send({
            code: http_status_codes_1.StatusCodes.OK,
            data: orders,
        });
    }
    catch (e) {
        return next(e);
    }
});
const getOrdersHistoryHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orders_service_1.OrdersService.getOrdersHistory();
        return res.status(http_status_codes_1.StatusCodes.OK).send({
            code: http_status_codes_1.StatusCodes.OK,
            data: orders,
        });
    }
    catch (e) {
        return next(e);
    }
});
const getTableOrdersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orders_service_1.OrdersService.getTableOrders(req.params.tableId);
        return res.status(http_status_codes_1.StatusCodes.OK).send({
            code: http_status_codes_1.StatusCodes.OK,
            data: orders,
        });
    }
    catch (e) {
        return next(e);
    }
});
exports.OrdersController = {
    newOrderHandler,
    updateOrderHandler,
    updateOrderStatusHandler,
    getTodayOrdersHandler,
    getOrdersHistoryHandler, getTableOrdersHandler
};

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
const newOrderHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { dishes, tableId } = req.body;
    const { tableId: clientTableCode } = req.user;
    try {
        yield orders_service_1.OrdersService.createNewOrder(dishes, tableId !== null && tableId !== void 0 ? tableId : clientTableCode);
        return res.status(http_status_codes_1.StatusCodes.OK).send({
            code: http_status_codes_1.StatusCodes.OK,
            message: `order added to table ${tableId}`,
        });
    }
    catch (e) {
        next(e);
    }
});
exports.OrdersController = {
    newOrderHandler,
};

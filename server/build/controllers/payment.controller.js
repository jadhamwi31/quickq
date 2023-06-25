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
exports.PaymentController = void 0;
const payment_service_1 = require("../services/payment.service");
const http_status_codes_1 = require("http-status-codes");
const newPaymentHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { tableId, amountPaid } = req.body;
    try {
        yield payment_service_1.PaymentService.newPayment(tableId, amountPaid);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ message: "new payment added", code: http_status_codes_1.StatusCodes.OK });
    }
    catch (e) {
        next(e);
    }
});
const getPaymentsHistoryHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentsHistory = yield payment_service_1.PaymentService.getPaymentsHistory();
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ data: paymentsHistory, code: http_status_codes_1.StatusCodes.OK });
    }
    catch (e) {
        next(e);
    }
});
const getPaymentsTodayHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield payment_service_1.PaymentService.getTodayPayments();
        return res.status(http_status_codes_1.StatusCodes.OK).send({
            code: http_status_codes_1.StatusCodes.OK,
            data: payments,
        });
    }
    catch (e) {
        next(e);
    }
});
exports.PaymentController = {
    newPaymentHandler,
    getPaymentsHistoryHandler,
    getPaymentsTodayHandler,
};

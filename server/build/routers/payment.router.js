"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const payment_validators_1 = require("../validators/payment.validators");
const payment_controller_1 = require("../controllers/payment.controller");
exports.PaymentRouter = (0, express_1.Router)();
exports.PaymentRouter.post("/", (0, auth_middleware_1.authFor)(["cashier", "manager"]), payment_validators_1.PaymentValidator.validateNewPayment, payment_controller_1.PaymentController.newPaymentHandler);
exports.PaymentRouter.get("/history", (0, auth_middleware_1.authFor)(["manager"]), payment_controller_1.PaymentController.getPaymentsHistoryHandler);
exports.PaymentRouter.get("/today", (0, auth_middleware_1.authFor)(["cashier", "manager"]), payment_controller_1.PaymentController.getPaymentsTodayHandler);

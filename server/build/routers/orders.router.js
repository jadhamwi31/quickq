"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRouter = void 0;
const express_1 = require("express");
const orders_validators_1 = require("../validators/orders.validators");
const orders_controller_1 = require("../controllers/orders.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
exports.OrdersRouter = (0, express_1.Router)();
exports.OrdersRouter.post("/", (0, auth_middleware_1.authFor)(["client", "cashier", "manager"]), orders_validators_1.OrdersValidators.validateNewOrder, orders_controller_1.OrdersController.newOrderHandler);

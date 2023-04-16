import { Router } from "express";
import { OrdersValidators } from "../validators/orders.validators";
import { OrdersController } from "../controllers/orders.controller";
import { authFor } from "../middlewares/auth.middleware";

export const OrdersRouter = Router();

OrdersRouter.post(
	"/",
	authFor(["client", "cashier", "manager"]),
	OrdersValidators.validateNewOrder,
	OrdersController.newOrderHandler
);

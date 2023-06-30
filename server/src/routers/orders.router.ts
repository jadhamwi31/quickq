import {Router} from "express";
import {OrdersController} from "../controllers/orders.controller";
import {authFor} from "../middlewares/auth.middleware";
import {OrdersValidators} from "../validators/orders.validators";

export const OrdersRouter = Router();

OrdersRouter.post(
    "/",
    authFor(["client", "cashier", "manager"]),
    OrdersValidators.validateNewOrder,
    OrdersController.newOrderHandler
);

OrdersRouter.put(
    "/:id",
    authFor(["client", "cashier", "manager"]),
    OrdersValidators.validateUpdateOrder,
    OrdersController.updateOrderHandler
);

OrdersRouter.put(
    "/:id/status",
    authFor(["chef", "manager", "cashier", "client"]),
    OrdersValidators.validateUpdateOrderStatus,
    OrdersController.updateOrderStatusHandler
);

OrdersRouter.get(
    "/today",
    authFor(["chef", "cashier", "manager"]),
    OrdersController.getTodayOrdersHandler
);

OrdersRouter.get(
    "/today/:tableId",
    OrdersValidators.validateGetTableOrders,
    OrdersController.getTableOrdersHandler
);


OrdersRouter.get(
    "/history",
    authFor(["manager"]),
    OrdersController.getOrdersHistoryHandler
);

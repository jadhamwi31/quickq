import {NextFunction, Request, Response} from "express";
import {
    NewOrderType,
    OrderDishesType,
    UpdateOrderStatusType,
    UpdateOrderType,
} from "../ts/types/order.types";
import {OrdersService} from "../services/orders.service";
import {StatusCodes} from "http-status-codes";
import {ForbiddenError} from "../models/error.model";
import {Order} from "../models/order.model";

const newOrderHandler = async (
    req: Request<any, any, NewOrderType>,
    res: Response,
    next: NextFunction
) => {
    const {dishes, tableId} = req.body;
    const {tableId: clientTableId} = req.user;
    try {
        await OrdersService.createNewOrder(dishes, tableId ?? clientTableId);
        return res.status(StatusCodes.OK).send({
            code: StatusCodes.OK,
            message: `order added to table ${tableId || clientTableId}`,
        });
    } catch (e) {
        next(e);
    }
};

const updateOrderHandler = async (
    req: Request<Pick<Order, "id">, any, Partial<UpdateOrderType>>,
    res: Response,
    next: NextFunction
) => {
    const {role} = req.user;
    const {id} = req.params;
    const {dishesToMutate, dishesToRemove} = req.body;
    try {
        if (
            role === "client" &&
            !await OrdersService.orderBelongsToTable(id, req.user.tableId)
        ) {
            throw new ForbiddenError("order should belong to your table");
        }
        await OrdersService.updateOrder(id, dishesToMutate, dishesToRemove);
        return res
            .status(StatusCodes.OK)
            .send({message: "order updated successfully", code: StatusCodes.OK});
    } catch (e) {
        return next(e);
    }
};

const updateOrderStatusHandler = async (
    req: Request<Pick<Order, "id">, any, Partial<UpdateOrderStatusType>>,
    res: Response,
    next: NextFunction
) => {
    const {id} = req.params;
    const {status} = req.body;
    const {role} = req.user;
    try {
        if (
            role === "client" &&
            !await OrdersService.orderBelongsToTable(id, req.user.tableId)
        ) {
            throw new ForbiddenError("order should belong to your table");
        }
        await OrdersService.updateOrderStatus(id, status);
        return res
            .status(StatusCodes.OK)
            .send({message: "order updated successfully", code: StatusCodes.OK});
    } catch (e) {
        return next(e);
    }
};

const getTodayOrdersHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const orders = await OrdersService.getTodayOrders();
        return res.status(StatusCodes.OK).send({
            code: StatusCodes.OK,
            data: orders,
        });
    } catch (e) {
        return next(e);
    }
};

const getOrdersHistoryHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const orders = await OrdersService.getOrdersHistory();
        return res.status(StatusCodes.OK).send({
            code: StatusCodes.OK,
            data: orders,
        });
    } catch (e) {
        return next(e);
    }
};

const getTableOrdersHandler = async (
    req: Request<{ tableId: number }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const orders = await OrdersService.getTableOrders(req.params.tableId);
        return res.status(StatusCodes.OK).send({
            code: StatusCodes.OK,
            data: orders,
        });
    } catch (e) {
        return next(e);
    }
};


export const OrdersController = {
    newOrderHandler,
    updateOrderHandler,
    updateOrderStatusHandler,
    getTodayOrdersHandler,
    getOrdersHistoryHandler, getTableOrdersHandler
};

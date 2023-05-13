import { NextFunction, Request, Response } from "express";
import {
	NewOrderType,
	OrderDishesType,
	UpdateOrderStatusType,
	UpdateOrderType,
} from "../ts/types/order.types";
import { OrdersService } from "../services/orders.service";
import { StatusCodes } from "http-status-codes";
import { ForbiddenError } from "../models/error.model";

const newOrderHandler = async (
	req: Request<any, any, NewOrderType>,
	res: Response,
	next: NextFunction
) => {
	const { dishes, tableId } = req.body;
	const { tableId: clientTableId } = req.user;
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
	req: Request<{ orderId: number }, {}, Partial<UpdateOrderType>>,
	res: Response,
	next: NextFunction
) => {
	const { role } = req.user;
	const { orderId } = req.params;
	const { dishes } = req.body;
	try {
		if (
			role === "client" &&
			!OrdersService.orderBelongsToTable(orderId, req.user.tableId)
		) {
			throw new ForbiddenError("order should belong to your table");
		}
		await OrdersService.updateOrder(orderId, dishes);
		return res
			.status(200)
			.send({ message: "order updated successfully", code: StatusCodes.OK });
	} catch (e) {
		return next(e);
	}
};

const updateOrderStatusHandler = async (
	req: Request<{ orderId: number }, {}, Partial<UpdateOrderStatusType>>,
	res: Response,
	next: NextFunction
) => {
	const { orderId } = req.params;
	const { status } = req.body;
	try {
		await OrdersService.updateOrderStatus(orderId, status);
		return res
			.status(200)
			.send({ message: "order updated successfully", code: StatusCodes.OK });
	} catch (e) {
		return next(e);
	}
};

export const OrdersController = {
	newOrderHandler,
	updateOrderHandler,
	updateOrderStatusHandler,
};

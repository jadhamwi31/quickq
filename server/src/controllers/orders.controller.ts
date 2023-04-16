import { NextFunction, Request, Response } from "express";
import { NewOrderType, OrderDishesType } from "../ts/types/order.types";
import { OrdersService } from "../services/orders.service";
import { StatusCodes } from "http-status-codes";

const newOrderHandler = async (
	req: Request<any, any, NewOrderType>,
	res: Response,
	next: NextFunction
) => {
	const { dishes, tableId } = req.body;
	const { tableId: clientTableCode } = req.user;
	try {
		await OrdersService.createNewOrder(dishes, tableId ?? clientTableCode);
		return res.status(StatusCodes.OK).send({
			code: StatusCodes.OK,
			message: `order added to table ${tableId}`,
		});
	} catch (e) {
		next(e);
	}
};

export const OrdersController = {
	newOrderHandler,
};

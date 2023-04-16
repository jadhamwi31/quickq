import { NextFunction, Request, Response } from "express";
import { NewOrderType, OrderDishesType } from "../ts/types/order.types";
import { BadRequestError } from "../models/error.model";

const validateNewOrder = (
	req: Request<any, any, Partial<NewOrderType>>,
	res: Response,
	next: NextFunction
) => {
	const { dishes, tableId: tableNumber } = req.body;
	if (!tableNumber) {
		return next(new BadRequestError("table number is required"));
	}
	if (dishes.length === 0) {
		return next(new BadRequestError("dishes are required"));
	}
	for (const orderDish of dishes) {
		if (!orderDish.name) {
			return next(new BadRequestError("dish name is missing"));
		}
		if (!orderDish.quantity) {
			orderDish.quantity = 1;
		}
	}
	return next();
};

export const OrdersValidators = { validateNewOrder };

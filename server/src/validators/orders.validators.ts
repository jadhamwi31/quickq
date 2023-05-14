import { NextFunction, Request, Response } from "express";
import {
	NewOrderType,
	OrderDishesType,
	UpdateOrderStatusType,
	UpdateOrderType,
} from "../ts/types/order.types";
import { BadRequestError } from "../models/error.model";
import { Order } from "../models/order.model";

const validateNewOrder = (
	req: Request<any, any, Partial<NewOrderType>>,
	res: Response,
	next: NextFunction
) => {
	const { dishes, tableId } = req.body;
	const { tableId: clientTableId } = req.user;

	if (!clientTableId && !tableId) {
		return next(new BadRequestError("table id is required"));
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

const validateUpdateOrder = (
	req: Request<Pick<Order, "id">, any, Partial<UpdateOrderType>>,
	res: Response,
	next: NextFunction
) => {
	const { dishes } = req.body;
	const { id } = req.params;
	if (!dishes) {
		return next(new BadRequestError("dishes are missing"));
	}
	dishes.forEach((dish) => {
		if (!dish.name) {
			return next(new BadRequestError("dish name is missing"));
		}
	});
	if (!id) {
		return next(new BadRequestError("order id parameter is missing"));
	}

	return next();
};

const validateUpdateOrderStatus = (
	req: Request<Pick<Order, "id">, any, Partial<UpdateOrderStatusType>>,
	res: Response,
	next: NextFunction
) => {
	const { status } = req.body;
	const { id } = req.params;
	if (!status) {
		return next(new BadRequestError("dishes are missing"));
	}
	if (!id) {
		return next(new BadRequestError("order id parameter is missing"));
	}

	return next();
};

export const OrdersValidators = {
	validateNewOrder,
	validateUpdateOrder,
	validateUpdateOrderStatus,
};

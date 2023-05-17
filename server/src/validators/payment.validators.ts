import { NextFunction, Request, Response } from "express";
import { INewPayment } from "../ts/interfaces/payment.interfaces";
import { BadRequestError } from "../models/error.model";

const validateNewPayment = (
	req: Request<{}, {}, Partial<INewPayment>>,
	res: Response,
	next: NextFunction
) => {
	const { tableId, amountPaid } = req.body;
	if (!tableId) {
		return next(new BadRequestError("table id is missing"));
	}
	if (!amountPaid) {
		return next(new BadRequestError("amount is missing"));
	}

	return next();
};

export const PaymentValidator = {
	validateNewPayment,
};

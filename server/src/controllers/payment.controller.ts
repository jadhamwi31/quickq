import { NextFunction, Request, Response } from "express";
import { INewPayment } from "../ts/interfaces/payment.interfaces";
import { PaymentService } from "../services/payment.service";
import { StatusCodes } from "http-status-codes";

const newPaymentHandler = async (
	req: Request<{}, {}, INewPayment>,
	res: Response,
	next: NextFunction
) => {
	const { tableId, amountPaid } = req.body;
	try {
		await PaymentService.newPayment(tableId, amountPaid);
		return res
			.status(StatusCodes.OK)
			.send({ message: "new payment added", code: StatusCodes.OK });
	} catch (e) {
		next(e);
	}
};

const getPaymentsHistoryHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const paymentsHistory = await PaymentService.getPaymentsHistory();
		return res
			.status(StatusCodes.OK)
			.send({ data: paymentsHistory, code: StatusCodes.OK });
	} catch (e) {
		next(e);
	}
};

const getPaymentsTodayHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const payments = await PaymentService.getTodayPayments();
		return res.status(StatusCodes.OK).send({
			code: StatusCodes.OK,
			data: payments,
		});
	} catch (e) {
		next(e);
	}
};

export const PaymentController = {
	newPaymentHandler,
	getPaymentsHistoryHandler,
	getPaymentsTodayHandler,
};

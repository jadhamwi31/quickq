import { NextFunction, Request, Response } from "express";
import { CustomError } from "../models/error.model";

export const errorMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log(err.stack);
	if (err instanceof CustomError) {
		return res
			.status(err.status)
			.send({ code: err.status, message: err.message, name: err.name });
	} else {
		return res.status(500).send(err.message);
	}
};

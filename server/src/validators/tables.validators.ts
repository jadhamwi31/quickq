import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../models/error.model";
import { Table } from "../models/table.model";

const validateNewTable = (
	req: Request<any, any, Partial<Pick<Table, "id">>>,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.body;
	if (!id) {
		return next(new BadRequestError("id is required"));
	}
	return next();
};

export const TablesValidators = {
	validateNewTable,
};

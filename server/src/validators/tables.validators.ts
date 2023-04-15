import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../models/error.model";
import { Table } from "../models/table.model";

const validateNewTable = async (
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

const validateUpdateTable = async (
	req: Request<Partial<Pick<Table, "id">>, any, Partial<Pick<Table, "status">>>,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	const { status } = req.body;
	if (!id) {
		return next(new BadRequestError("id parameter is required"));
	}
	if (!status) {
		return next(new BadRequestError("key : [status] is required"));
	}
	if (!(status === "Available" || status == "Busy")) {
		return next(new BadRequestError("invalid table status"));
	}
	return next();
};

const validateDeleteTable = async (
	req: Request<Partial<Pick<Table, "id">>>,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	if (!id) {
		return next(new BadRequestError("id parameter is required"));
	}

	return next();
};

export const TablesValidators = {
	validateNewTable,
	validateUpdateTable,
	validateDeleteTable,
};

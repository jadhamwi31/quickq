import { NextFunction, Request, Response } from "express";
import { Table } from "../models/table.model";
import { TablesService } from "../services/tables.service";
import { StatusCodes } from "http-status-codes";

const newTableHandler = async (
	req: Request<any, any, Pick<Table, "id">>,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.body;
	try {
		await TablesService.createNewTable(id);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "table added" });
	} catch (e) {
		next(e);
	}
};

export const TablesController = { newTableHandler };

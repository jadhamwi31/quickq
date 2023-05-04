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
		const tableCode = await TablesService.createNewTable(id);
		return res.status(StatusCodes.OK).send({
			code: StatusCodes.OK,
			message: "table added",
			data: { table_code: tableCode },
		});
	} catch (e) {
		next(e);
	}
};

const updateTableHandler = async (
	req: Request<Pick<Table, "id">, any, Pick<Table, "status">>,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	const { status } = req.body;
	try {
		await TablesService.updateTable(id, status);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "table updated" });
	} catch (e) {
		next(e);
	}
};

const deleteTableHandler = async (
	req: Request<Pick<Table, "id">>,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	try {
		await TablesService.deleteTable(id);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "table deleted" });
	} catch (e) {
		next(e);
	}
};

const getTablesHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const tables = await TablesService.getTables();
		return res.status(StatusCodes.OK).send(tables);
	} catch (e) {
		next(e);
	}
};

const openNewTableSessionHandler = async (
	req: Request<Pick<Table, "id">>,
	res: Response,
	next: NextFunction
) => {
	const { id: tableId } = req.params;
	try {
		await TablesService.openNewTableSession(tableId);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "new table session created" });
	} catch (e) {
		next(e);
	}
};

export const TablesController = {
	newTableHandler,
	updateTableHandler,
	deleteTableHandler,
	getTablesHandler,
	openNewTableSessionHandler,
};
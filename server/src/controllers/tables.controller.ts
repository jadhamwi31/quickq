import { NextFunction, Request, Response } from "express";
import { Table } from "../models/table.model";
import { TablesService } from "../services/tables.service";
import { StatusCodes } from "http-status-codes";
import { ForbiddenError } from "../models/error.model";
import { v4 as uuid } from "uuid";

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
	const { role, tableId: clientTableId } = req.user;

	try {
		if (role === "client" && clientTableId != tableId) {
			throw new ForbiddenError("that's not your table");
		}

		await TablesService.openNewTableSession(
			tableId,
			req.user.clientId || uuid()
		);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "new table session created" });
	} catch (e) {
		next(e);
	}
};

const checkoutTableHandler = async (
	req: Request<Pick<Table, "id">>,
	res: Response,
	next: NextFunction
) => {
	const { id: tableId } = req.params;

	const { role, tableId: clientTableId } = req.user;
	try {
		if (role === "client" && clientTableId != tableId) {
			throw new ForbiddenError("that's not your table");
		}
		const data = await TablesService.checkoutTable(tableId);
		return res.status(StatusCodes.OK).send({ code: StatusCodes.OK, data });
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
	checkoutTableHandler,
};

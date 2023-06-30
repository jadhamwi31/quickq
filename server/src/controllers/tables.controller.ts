import { NextFunction, Request, Response } from "express";
import { Table } from "../models/table.model";
import { TablesService } from "../services/tables.service";
import { StatusCodes } from "http-status-codes";
import { ForbiddenError } from "../models/error.model";
import { v4 as uuid } from "uuid";
import { IRedisTableOrder } from "../ts/interfaces/order.interfaces";

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

const closeTableSessionHandler = async (
	req: Request<Pick<Table, "id">>,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	try {
		await TablesService.closeTableSession(id);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "table session closed" });
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
		const tables = await TablesService.getTables(req.user.role);
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
	const { role, clientId,tableId:clientTableId } = req.user;

	try {
		if (role === "client") {

			await TablesService.openNewTableSession(clientTableId, clientId);
		} else {
			await TablesService.openNewTableSession(tableId, uuid());
		}

		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "opened table session" });
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
		let data: {
			receipt: IRedisTableOrder[];
			total: number;
		};

		if (role === "client") {

			data = await TablesService.checkoutTable(clientTableId);
		} else {
			data = await TablesService.checkoutTable(tableId);
		}
		return res.status(StatusCodes.OK).send({ code: StatusCodes.OK, data });
	} catch (e) {
		next(e);
	}
};

export const TablesController = {
	newTableHandler,
	closeTableSessionHandler,
	deleteTableHandler,
	getTablesHandler,
	openNewTableSessionHandler,
	checkoutTableHandler,
};

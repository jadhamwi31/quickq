import { v4 as uuid } from "uuid";
import { AppDataSource } from "../models";
import {
	BadRequestError,
	ConflictError,
	NotFoundError,
} from "../models/error.model";
import { Payment } from "../models/payment.model";
import { Table, TableCode, TableSession } from "../models/table.model";
import { TableStatus } from "../ts/types/table.types";
import RedisService from "./redis.service";
import { OrdersService } from "./orders.service";
import { UserRoleType } from "../ts/types/user.types";
import WebsocketService from "./websocket.service";

const getTableSessionClientId = async (tableId: number) => {
	const isTableSessionCached = await RedisService.isCached(
		"tables:sessions",
		String(tableId)
	);
	if (isTableSessionCached) {
		const clientId = await RedisService.getCachedVersion(
			"tables:sessions",
			String(tableId)
		);
		return clientId;
	} else {
		const tableSession = await AppDataSource.getRepository(
			TableSession
		).findOne({
			relations: { table: true },
			where: { table: { id: tableId } },
		});

		if (tableSession.clientId) {
			await RedisService.redis.hset(
				"tables:sessions",
				String(tableId),
				tableSession.clientId
			);
			return tableSession.clientId;
		}
		throw new BadRequestError("open table session first");
	}
};

const createNewTable = async (id: number) => {
	const tablesRepo = AppDataSource.getRepository(Table);
	const tablesCodesRepo = AppDataSource.getRepository(TableCode);
	const tablesSessionsRepo = AppDataSource.getRepository(TableSession);
	const tableExists = await tablesRepo.findOneBy({ id });
	if (tableExists) {
		throw new ConflictError("table with this id already exists");
	}
	const tableRecord = new Table();
	const tableCodeRecord = new TableCode();
	const tableSession = new TableSession();
	try {
		tableRecord.id = id;
		tableRecord.status = "Available";

		await tablesRepo.save(tableRecord);
		tableCodeRecord.code = uuid();
		tableCodeRecord.table = tableRecord;

		await tablesCodesRepo.save(tableCodeRecord);
		tableSession.table = tableRecord;

		await tablesSessionsRepo.save(tableSession);

		return tableCodeRecord.code;
	} catch (e) {
		await tablesRepo.remove(tableRecord);
		await tablesCodesRepo.remove(tableCodeRecord);
		await tablesSessionsRepo.remove(tableSession);
	}
};

const updateTable = async (id: number, status: TableStatus) => {
	const tablesRepo = AppDataSource.getRepository(Table);

	const tableRecord = await tablesRepo.findOneBy({ id });
	if (!tableRecord) {
		throw new NotFoundError("table with this id doesn't exist");
	}
	if (tableRecord.status !== status) {
		tableRecord.status = status;
		WebsocketService.getIo().emit("update_table_status", id, status);
	}
	await tablesRepo.save(tableRecord);
};

const deleteTable = async (id: number) => {
	const tablesRepo = AppDataSource.getRepository(Table);

	const tableRecord = await tablesRepo.findOneBy({ id });
	if (!tableRecord) {
		throw new NotFoundError("table with this id doesn't exist");
	}
	await tablesRepo.remove(tableRecord);
};

const getTables = async (role: UserRoleType) => {
	const tablesCodesRepo = AppDataSource.getRepository(TableCode);

	const tablesCodes = await tablesCodesRepo.find({
		relations: { table: true },
		select: ["table", "code"],
	});

	return tablesCodes.map((tableCode) => ({
		code: role === "manager" ? tableCode.code : undefined,
		id: tableCode.table.id,
		status: tableCode.table.status,
	}));
};

const openNewTableSession = async (tableId: number, clientId: string) => {
	const paymentsRepo = AppDataSource.getRepository(Payment);
	const tablesRepo = AppDataSource.getRepository(Table);
	const table = await tablesRepo.findOneBy({ id: tableId });
	if (table.status === "Busy") {
		throw new BadRequestError("table is busy");
	}
	const payment = new Payment();
	table.status = "Busy";
	payment.clientId = clientId;
	await paymentsRepo.save(payment);
	await tablesRepo.save(table);

	const tablesSessionsRepo = AppDataSource.getRepository(TableSession);
	const tableSessionRecord = await tablesSessionsRepo.findOne({
		relations: { table: true },
		where: { table: { id: tableId } },
	});
	tableSessionRecord.clientId = clientId;
	await tablesSessionsRepo.save(tableSessionRecord);
	await RedisService.redis.hset("tables:sessions", String(tableId), clientId);
};

const checkoutTable = async (tableId: number) => {
	const orders = await OrdersService.getTodayOrders();

	const tableOrders = orders.filter((order) => order.tableId == tableId);

	const total = tableOrders.reduce(
		(total, current) => total + current.total,
		0
	);

	return { receipt: tableOrders, total };
};

export const TablesService = {
	createNewTable,
	updateTable,
	deleteTable,
	getTables,
	openNewTableSession,
	checkoutTable,
	getTableSessionClientId,
};

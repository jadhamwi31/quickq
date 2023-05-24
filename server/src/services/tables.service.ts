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

const getTableSessionClientId = async (tableId: number) => {
	const sessionCacheHit = await RedisService.redis.hexists(
		"tables:sessions",
		String(tableId)
	);
	if (!sessionCacheHit) {
		const tableSession = await AppDataSource.getRepository(
			TableSession
		).findOne({
			relations: { table: true },
			where: { table: { id: tableId } },
		});
		if (tableSession) {
			if (tableSession.clientId) return tableSession.clientId;
			throw new BadRequestError("open table session first");
		}
	} else {
		const clientId = await RedisService.redis.hget(
			"tables:sessions",
			String(tableId)
		);
		return clientId;
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

		await tablesRepo.insert(tableRecord);
		tableCodeRecord.code = uuid();
		tableCodeRecord.table = tableRecord;

		await tablesCodesRepo.insert(tableCodeRecord);
		tableSession.table = tableRecord;

		await tablesSessionsRepo.save(tableSession);

		return tableCodeRecord.code;
	} catch (e) {
		tablesRepo.remove(tableRecord);
		tablesCodesRepo.remove(tableCodeRecord);
	}
};

const updateTable = async (id: number, status: TableStatus) => {
	const tablesRepo = AppDataSource.getRepository(Table);

	const tableRecord = await tablesRepo.findOneBy({ id });
	if (!tableRecord) {
		throw new NotFoundError("table with this id doesn't exist");
	}
	tableRecord.status = status;
	await tablesRepo.save(tableRecord);
};

const deleteTable = async (id: number) => {
	const tablesRepo = AppDataSource.getRepository(Table);

	const tableRecord = await tablesRepo.findOneBy({ id });
	if (!tableRecord) {
		throw new NotFoundError("table with this id doesn't exist");
	}
	await tablesRepo.delete(tableRecord);
};

const getTables = async () => {
	const tablesCodesRepo = AppDataSource.getRepository(TableCode);

	const tablesCodes = await tablesCodesRepo.find({
		relations: { table: true },
		select: ["table", "code"],
	});

	return tablesCodes.map((tableCode) => ({
		code: tableCode.code,
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
	await paymentsRepo.insert(payment);
	await tablesRepo.save(table);

	const redisTableClientId = await RedisService.redis.hget(
		"tables:sessions",
		String(tableId)
	);

	if (redisTableClientId === null) {
		await RedisService.redis.hset("tables:sessions", String(tableId), clientId);
	}
};

const checkoutTable = async (tableId: number) => {
	const orders = await OrdersService.getTodayOrders();

	const tableOrders = orders.filter((order) => order.tableId == tableId);
	console.log(tableOrders);

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

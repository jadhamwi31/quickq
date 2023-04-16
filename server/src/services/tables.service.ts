import { uniqueId } from "lodash";
import { AppDataSource } from "../models";
import { ConflictError, NotFoundError } from "../models/error.model";
import { Table, TableCode } from "../models/table.model";
import { TableStatus } from "../ts/types/table.types";
import { v4 as uuid } from "uuid";
import RedisService from "./redis.service";
import { Payment } from "../models/payment.model";
const createNewTable = async (id: number) => {
	const tablesRepo = AppDataSource.getRepository(Table);
	const tablesCodesRepo = AppDataSource.getRepository(TableCode);
	const tableExists = await tablesRepo.findOneBy({ id });
	if (tableExists) {
		throw new ConflictError("table with this id already exists");
	}
	const tableRecord = new Table();
	const tableCodeRecord = new TableCode();
	try {
		tableRecord.id = id;
		tableRecord.status = "Available";
		await tablesRepo.insert(tableRecord);
		tableCodeRecord.code = uuid();
		tableCodeRecord.table = tableRecord;

		await tablesCodesRepo.insert(tableCodeRecord);
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

const openTable = async (tableId: number) => {
	const paymentsRepo = AppDataSource.getRepository(Payment);
	const paymentId = uuid();
	const payment = new Payment();
	payment.id = paymentId;
	paymentsRepo.insert(payment);
	RedisService.redis.hset(
		"tables",
		String(tableId),
		JSON.stringify({
			paymentId,
			status: "Busy",
		})
	);
	RedisService.redis.publish(
		"tables_statuses",
		JSON.stringify({
			tableId,
			status: "Busy",
		})
	);
};

export const TablesService = {
	createNewTable,
	updateTable,
	deleteTable,
	getTables,
	openTable,
};

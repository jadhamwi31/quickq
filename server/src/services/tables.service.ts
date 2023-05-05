import { uniqueId } from "lodash";
import { AppDataSource } from "../models";
import {
	BadRequestError,
	ConflictError,
	NotFoundError,
} from "../models/error.model";
import { Table, TableCode } from "../models/table.model";
import { TableStatus } from "../ts/types/table.types";
import { v4 as uuid } from "uuid";
import RedisService from "./redis.service";
import { Payment } from "../models/payment.model";
import { IRedisTableValue } from "../ts/interfaces/tables.interfaces";
import { Order } from "../models/order.model";
import { IRedisTableOrder } from "../ts/interfaces/order.interfaces";
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

const openNewTableSession = async (tableId: number) => {
	const paymentsRepo = AppDataSource.getRepository(Payment);
	const tablesRepo = AppDataSource.getRepository(Table);
	const table = await tablesRepo.findOneBy({ id: tableId });
	if (table.status === "Busy") {
		throw new BadRequestError("table is busy");
	}
	const paymentId = uuid();
	const payment = new Payment();
	table.status = "Busy";
	table.current_payment_id = paymentId;
	payment.id = paymentId;
	await paymentsRepo.insert(payment);
	await tablesRepo.save(table);

	RedisService.redis.hset(
		`tables:states`,
		String(tableId),
		JSON.stringify({
			paymentId,
			status: "Busy",
		})
	);
	RedisService.redis.publish(
		"table_status",
		JSON.stringify({
			tableId,
			status: "Busy",
		})
	);
};

const checkoutTable = async (tableId: number) => {
	const tableOrders = await RedisService.redis
		.hgetall(`tables:orders:${tableId}`)
		.then((records): IRedisTableOrder[] => {
			return Object.values(records).map((order) => {
				return JSON.parse(order);
			});
		});
	const checkoutTotal = tableOrders.reduce((total, currentOrder) => {
		return (
			total +
			currentOrder.dishes.reduce((orderTotal, currentDish) => {
				console.log(currentDish);

				return orderTotal + currentDish.price * currentDish.quantity;
			}, 0)
		);
	}, 0);

	return {
		dishes: [...tableOrders.map((order) => order.dishes)].flat(),
		total: checkoutTotal,
	};
};

export const TablesService = {
	createNewTable,
	updateTable,
	deleteTable,
	getTables,
	openNewTableSession,
	checkoutTable,
};

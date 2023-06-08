import { Between, Equal, LessThan } from "typeorm";
import { AppDataSource } from "../models";
import { BadRequestError, ForbiddenError } from "../models/error.model";
import { Payment } from "../models/payment.model";
import { IRedisTableOrder } from "../ts/interfaces/order.interfaces";
import { IRedisTableValue } from "../ts/interfaces/tables.interfaces";
import RedisService from "./redis.service";
import { TablesService } from "./tables.service";
import moment from "moment";
import { Table, TableSession } from "../models/table.model";
import { IRedisPayment } from "../ts/interfaces/payment.interfaces";
import WebsocketService from "./websocket.service";
import { UserRoleType } from "../ts/types/user.types";

const newPayment = async (tableId: number, amountPaid: number) => {
	const { total } = await TablesService.checkoutTable(tableId);
	const clientId = await TablesService.getTableSessionClientId(tableId);
	const tablesRepo = AppDataSource.getRepository(Table);
	if (total !== amountPaid) {
		throw new ForbiddenError(`amount paid not equel to check total ${total}`);
	}

	const { receipt } = await TablesService.checkoutTable(tableId);
	receipt.forEach((tableOrder) => {
		if (tableOrder.status !== "Ready") {
			throw new BadRequestError("pending/in-cook orders still present");
		}
	});

	const paymentsRepo = AppDataSource.getRepository(Payment);
	const payment = await paymentsRepo.findOneBy({ clientId });
	if (payment) {
		payment.date = new Date();
		payment.amount = amountPaid;
		paymentsRepo.save(payment);
	} else {
		throw new BadRequestError("no payment for this table right now");
	}

	const tablesSessionsRepo = AppDataSource.getRepository(TableSession);
	const tableSessionRecord = await tablesSessionsRepo.findOne({
		relations: { table: true },
		where: { table: { id: tableId } },
	});
	tableSessionRecord.clientId = null;
	tablesSessionsRepo.save(tableSessionRecord);
	// Clear Table Session From Cache
	await RedisService.redis.hdel("tables:sessions", String(tableId));
	// Table Orers
	const redisTablesOrders: { [orderId: string]: string } =
		await RedisService.redis.hgetall("orders");

	// Clear Table Orders From Cache
	for (const _order of Object.values(redisTablesOrders)) {
		const order: IRedisTableOrder = JSON.parse(_order);
		if (order.tableId == tableId) {
			await RedisService.redis.hdel("orders", String(order.id));
		}
	}

	// Previous Cache Values
	const prevTransactions: Payment[] = JSON.parse(
		await RedisService.redis.hget("payments", "transactions")
	);
	const prevPayins = await RedisService.redis.hget("payments", "payins");

	// Update Trasanctions In Cache
	await RedisService.redis.hset(
		"payments",
		"transactions",
		JSON.stringify([
			...prevTransactions,
			{
				date: payment.date.toString(),
				amount: payment.amount,
				tableId,
			} as IRedisPayment,
		])
	);
	// Update Payins In Cache
	await RedisService.redis.hset(
		"payments",
		"payins",
		prevPayins + payment.amount
	);

	WebsocketService.getIo()
		.to(["cashier", "manager"] as UserRoleType[])
		.emit("increment_payins", payment.amount);

	// Update Table Status
	const tableRecord = await tablesRepo.findOneBy({ id: tableId });
	tableRecord.status = "Available";
	await tablesRepo.save(tableRecord);
};

const getPaymentsHistory = async () => {
	return await AppDataSource.createQueryBuilder()
		.from(Payment, "payment")
		.addSelect(["payment.date", "payment.amount"])
		.leftJoin("payment.orders", "order")
		.getMany();
};

const getTodayPayments = async () => {
	const arePaymentsCached = await RedisService.isCached("payments");
	if (arePaymentsCached) {
		const transactions = JSON.parse(
			await RedisService.getCachedVersion("payments", "transactions")
		);
		const payins = Number(
			await RedisService.getCachedVersion("payments", "payins")
		);
		return {
			transactions,
			payins,
		};
	} else {
		const dayStart = moment().startOf("day").toDate();
		const dayEnd = moment().endOf("day").toDate();

		const transactions = await AppDataSource.getRepository(Payment).find({
			where: { date: Between(dayStart, dayEnd) },
			select: ["date", "amount", "clientId"],
		});
		const payins = transactions.reduce(
			(prev, current) => prev + current.amount,
			0
		);

		// Update Payments in Cache
		await RedisService.redis.hset(
			"payments",
			"transactions",
			JSON.stringify(transactions)
		);
		await RedisService.redis.hset("payments", "payins", payins);
		return {
			transactions,
			payins,
		};
	}
};

export const PaymentService = {
	newPayment,
	getPaymentsHistory,
	getTodayPayments,
};

import { Between, Equal, LessThan } from "typeorm";
import { AppDataSource } from "../models";
import { BadRequestError, ForbiddenError } from "../models/error.model";
import { Payment } from "../models/payment.model";
import { IRedisTableOrder } from "../ts/interfaces/order.interfaces";
import { IRedisTableValue } from "../ts/interfaces/tables.interfaces";
import RedisService from "./redis.service";
import { TablesService } from "./tables.service";
import moment from "moment";
import { TableSession } from "../models/table.model";
import { IRedisPayment } from "../ts/interfaces/payment.interfaces";

const newPayment = async (tableId: number, amountPaid: number) => {
	const { total } = await TablesService.checkoutTable(tableId);

	if (total !== amountPaid) {
		throw new ForbiddenError(`amount paid not equel to check total ${total}`);
	}

	const { receipt } = await TablesService.checkoutTable(tableId);
	receipt.forEach((tableOrder) => {
		if (tableOrder.status !== "Done") {
			throw new BadRequestError("pending/in-cook orders still present");
		}
	});

	const clientId = await TablesService.getTableSessionClientId(tableId);

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
	await RedisService.redis.hdel("tables:sessions", String(tableId));
	const redisTablesOrders: { [orderId: string]: string } =
		await RedisService.redis.hgetall("orders");

	for (const _order of Object.values(redisTablesOrders)) {
		const order: IRedisTableOrder = JSON.parse(_order);
		if (order.tableId == tableId) {
			await RedisService.redis.hdel("orders", String(order.id));
		}
	}

	const prevTransactions: Payment[] = JSON.parse(
		await RedisService.redis.hget("payments", "transactions")
	);
	const prevPayins = await RedisService.redis.hget("payments", "payins");
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
	await RedisService.redis.hset(
		"payments",
		"payins",
		prevPayins + payment.amount
	);
};

const getPaymentsHistory = async () => {
	return await AppDataSource.createQueryBuilder()
		.from(Payment, "payment")
		.addSelect(["payment.date", "payment.amount"])
		.leftJoin("payment.orders", "order")
		.getMany();
};

const getTodayPayments = async () => {
	const paymentsCacheHit = await RedisService.redis.exists("payments");
	if (!paymentsCacheHit) {
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
	} else {
		const transactions = await RedisService.redis.hget(
			"payments",
			"transactions"
		);
		const payins = await RedisService.redis.hget("payments", "payins");
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

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

const newPayment = async (tableId: number, amountPaid: number) => {
	const { total } = await TablesService.checkoutTable(tableId);

	if (total !== amountPaid) {
		throw new ForbiddenError(`amount paid not equel to check total ${total}`);
	}

	const {
		payment: { orders },
	} = await TablesService.checkoutTable(tableId);
	orders.forEach((tableOrder) => {
		if (tableOrder.status !== "Done") {
			throw new BadRequestError("pending/in-cook orders still present");
		}
	});

	const clientId = await RedisService.redis.hget(
		"tables:sessions",
		String(tableId)
	);

	const paymentsRepo = AppDataSource.getRepository(Payment);
	const payment = await paymentsRepo.findOneBy({ clientId });
	if (payment) {
		payment.date = new Date();
		payment.amount = amountPaid;
		paymentsRepo.save(payment);
	} else {
		throw new BadRequestError("no payment for this table right now");
	}

	await RedisService.redis.hset("tables:sessions", String(tableId), null);
	const tablesSessionsRepo = await AppDataSource.getRepository(TableSession);
	const tableSessionRecord = await tablesSessionsRepo.findOne({
		relations: { table: true },
		where: { table: { id: tableId } },
	});
	tableSessionRecord.clientId = null;
	tablesSessionsRepo.save(tableSessionRecord);
};

const getPaymentsHistory = async () => {
	return await AppDataSource.createQueryBuilder()
		.from(Payment, "payment")
		.addSelect(["payment.date", "payment.amount"])
		.leftJoin("payment.orders", "order")
		.getMany();
};

const getTodayPayments = async () => {
	const dayStart = moment().startOf("day").toDate();
	const dayEnd = moment().endOf("day").toDate();

	const todayPayments = await AppDataSource.getRepository(Payment).find({
		where: { date: Between(dayStart, dayEnd) },
	});

	return {
		payments: todayPayments,
		total: todayPayments.reduce((prev, current) => prev + current.amount, 0),
	};
};

export const PaymentService = {
	newPayment,
	getPaymentsHistory,
	getTodayPayments,
};

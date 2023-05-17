import { AppDataSource } from "../models";
import { BadRequestError, ForbiddenError } from "../models/error.model";
import { Payment } from "../models/payment.model";
import { IRedisTableOrder } from "../ts/interfaces/order.interfaces";
import { IRedisTableValue } from "../ts/interfaces/tables.interfaces";
import { OrdersService } from "./orders.service";
import RedisService from "./redis.service";
import { TablesService } from "./tables.service";

const newPayment = async (tableId: number, amountPaid: number) => {
	const { total } = await TablesService.checkoutTable(tableId);

	if (total !== amountPaid) {
		throw new ForbiddenError(`amount paid not equel to check total ${total}`);
	}

	const tableOrders: IRedisTableOrder[] = Object.values(
		await RedisService.redis.hgetall(`tables:orders:${tableId}`)
	).map((order) => JSON.parse(order));
	tableOrders.forEach((tableOrder) => {
		if (tableOrder.status !== "Done") {
			throw new BadRequestError(
				"pending/in-cook orders are still in the queue"
			);
		}
	});

	const { paymentId }: IRedisTableValue = JSON.parse(
		await RedisService.redis.hget(`tables:states`, String(tableId))
	);
	const paymentsRepo = AppDataSource.getRepository(Payment);
	const payment = await paymentsRepo.findOneBy({ id: paymentId });
	if (payment) {
		payment.date = new Date();
		payment.amount = amountPaid;
		paymentsRepo.save(payment);
	} else {
		throw new BadRequestError("no payment for this table right now");
	}
	await RedisService.redis.hset(
		`tables:states`,
		String(tableId),
		JSON.stringify({
			paymentId: null,
			status: "Available",
		})
	);
	const prevPayins = Number(await RedisService.redis.get("payins"));
	await RedisService.redis.set("payins", prevPayins + amountPaid);
};

const getPaymentsHistory = async () => {
	return await AppDataSource.createQueryBuilder()
		.from(Payment, "payment")
		.addSelect(["payment.date", "payment.amount"])
		.leftJoin("payment.orders", "order")
		.getMany();
};

export const PaymentService = { newPayment, getPaymentsHistory };

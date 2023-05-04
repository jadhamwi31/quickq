import { AppDataSource } from "../models";
import { Dish } from "../models/dish.model";
import { BadRequestError, NotFoundError } from "../models/error.model";
import { Order } from "../models/order.model";
import { Payment } from "../models/payment.model";
import { OrderDish } from "../models/shared.model";
import { Table } from "../models/table.model";
import { IRedisTableValue } from "../ts/interfaces/tables.interfaces";
import { OrderDishesType } from "../ts/types/order.types";
import RedisService from "./redis.service";

const createNewOrder = async (newOrder: OrderDishesType, tableId: number) => {
	const dishesRepo = AppDataSource.getRepository(Dish);
	const tablesRepo = AppDataSource.getRepository(Table);
	const ordersRepo = AppDataSource.getRepository(Order);
	const paymentsRepo = AppDataSource.getRepository(Payment);
	const ordersDishesRepo = AppDataSource.getRepository(OrderDish);

	const tableRecord = await tablesRepo.findOneBy({ id: tableId });
	if (!tableRecord) {
		throw new NotFoundError(`table with id ${tableId} doesn't exist`);
	}

	const redisTableValue: IRedisTableValue = JSON.parse(
		await RedisService.redis.hget("tables", String(tableId))
	);
	if (redisTableValue.status === "Available") {
		throw new BadRequestError("open table before start ordering");
	}
	const order = new Order();
	const payment = await paymentsRepo.findOneBy({
		id: redisTableValue.paymentId,
	});
	order.payment = payment;
	order.table = tableRecord;
	order.orderDishes = [];
	order.status = "Pending";
	order.total = 0;
	order.orderDishes = [];
	for (const orderDish of newOrder) {
		const dishRecord = await dishesRepo.findOneBy({ name: orderDish.name });
		if (!dishRecord) {
			throw new NotFoundError(`${orderDish.name}: not found`);
		}
		order.total += dishRecord.price * orderDish.quantity;
		const newOrderDish = new OrderDish();
		newOrderDish.order = order;
		newOrderDish.dish = dishRecord;
		newOrderDish.quantity = orderDish.quantity;

		await ordersDishesRepo.insert(newOrderDish);

		order.orderDishes.push(newOrderDish);
	}

	await ordersRepo.insert(order);
};

export const OrdersService = {
	createNewOrder,
};

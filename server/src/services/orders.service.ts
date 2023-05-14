import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../models";
import { Dish } from "../models/dish.model";
import { BadRequestError, NotFoundError } from "../models/error.model";
import { Order } from "../models/order.model";
import { Payment } from "../models/payment.model";
import { DishIngredient, OrderDish } from "../models/shared.model";
import { Table } from "../models/table.model";
import {
	IOrderDish,
	IRedisTableOrder,
} from "../ts/interfaces/order.interfaces";
import { IRedisTableValue } from "../ts/interfaces/tables.interfaces";
import {
	OrderDishesType,
	OrderStatusType,
	RedisOrderDish,
	RedisOrdersQueueOrderType,
} from "../ts/types/order.types";
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
		await RedisService.redis.hget("tables:states", String(tableId))
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
	await ordersRepo.insert(order);
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
	await ordersRepo.save(order);

	const orderDishes: RedisOrderDish[] = [];
	order.orderDishes.forEach((orderDish) => {
		orderDishes.push({
			name: orderDish.dish.name,
			quantity: orderDish.quantity,
			id: orderDish.dish.id,
			price: orderDish.dish.price,
		});
	});

	const redisTableOrder: IRedisTableOrder = {
		id: order.id,
		dishes: orderDishes,
		status: "Pending",
	};

	await RedisService.redis.hset(
		`tables:orders:${tableId}`,
		order.id,
		JSON.stringify(redisTableOrder)
	);

	const redisOrdersQueueOrder: RedisOrdersQueueOrderType = {
		table_id: tableId,
		id: order.id,
		dishes: orderDishes,
		status: "Pending",
	};

	await RedisService.redis.hset(
		"orders",
		order.id,
		JSON.stringify(redisOrdersQueueOrder)
	);
};

const orderBelongsToTable = async (orderId: number, tableId: number) => {
	const ordersRepo = AppDataSource.getRepository(Order);

	const result = await ordersRepo.findOne({
		where: { id: orderId, table: { id: tableId } },
		relations: { table: true },
	});
	return result !== null;
};

const updateOrder = async (orderId: number, dishes: OrderDishesType) => {
	const ordersDishesRepo = AppDataSource.getRepository(OrderDish);
	const ordersRepo = AppDataSource.getRepository(Order);
	const orderDishesRecord = await ordersDishesRepo.find({
		relations: { dish: true, order: true },
		where: { order: { id: orderId } },
	});
	if (!orderDishesRecord) {
		throw new NotFoundError("order with this id was not found");
	}

	const {
		table: { id: tableId },
	} = await ordersRepo.findOne({
		relations: { table: true },
		where: { id: orderId },
	});

	orderDishesRecord.forEach((orderDish) => {
		const dish = dishes.find((dish) => dish.name === orderDish.dish.name);
		if (dish) {
			orderDish = {
				...orderDish,
				...dish,
			};
		}
	});

	ordersDishesRepo.save(orderDishesRecord);

	// Table Order Update
	const tableOrderPrevValue: IRedisTableOrder = JSON.parse(
		await RedisService.redis.hget(`tables:orders:${tableId}`, String(orderId))
	);
	const newTableOrderDishes = dishes.map((dish) => {
		const orderDishPrevValue = tableOrderPrevValue.dishes.find(
			(currentDish) => currentDish.name === dish.name
		);
		return { ...orderDishPrevValue, ...dish };
	});

	const tableOrderNewValue: IRedisTableOrder = {
		...tableOrderPrevValue,
		dishes: newTableOrderDishes,
	};

	await RedisService.redis.hset(
		`tables:orders:${tableId}`,
		orderId,
		JSON.stringify(tableOrderNewValue)
	);
	const ordersQueueOrderPrevValue: RedisOrdersQueueOrderType = JSON.parse(
		await RedisService.redis.hget(`tables:orders:${tableId}`, String(orderId))
	);

	const newOrdersQueueOrderDishes = dishes.map((dish) => {
		const orderDishPrevValue = ordersQueueOrderPrevValue.dishes.find(
			(currentDish) => currentDish.name === dish.name
		);
		return { ...orderDishPrevValue, ...dish };
	});

	const ordersQueueOrderNewValue: RedisOrdersQueueOrderType = {
		...ordersQueueOrderPrevValue,
		dishes: newOrdersQueueOrderDishes,
	};
	await RedisService.redis.hset(
		`orders`,
		orderId,
		JSON.stringify(ordersQueueOrderNewValue)
	);

	// const REDIS_ORDER_UPDATE_PUBLISH_MESSAGE = {
	// 	type: "order_update",
	// 	data: dishes,
	// };
};

const updateOrderStatus = async (orderId: number, status: OrderStatusType) => {
	const ordersRepo = AppDataSource.getRepository(Order);

	const orderRecord = await ordersRepo.findOne({
		where: { id: orderId },
		relations: { table: true },
	});
	if (!orderRecord) {
		throw new NotFoundError("order with this id was not found");
	}
	orderRecord.status = status;
	ordersRepo.save(orderRecord);
	// Table Order Status Update
	const tableOrderPrevValue: IRedisTableOrder = JSON.parse(
		await RedisService.redis.hget(
			`tables:orders:${orderRecord.table.id}`,
			String(orderRecord.id)
		)
	);
	const tableOrderNewValue: IRedisTableOrder = {
		...tableOrderPrevValue,
		status,
	};

	await RedisService.redis.hset(
		`tables:orders:${orderRecord.table.id}`,
		orderRecord.id,
		JSON.stringify(tableOrderNewValue)
	);

	// const ORDER_STATUS_UPDATE_PUBLISH_MESSAGE = {
	// 	type: "order_status_update",
	// 	data: {
	// 		orderId: orderId,
	// 		status,
	// 	},
	// };

	// Order Status Update In Orders Queue

	const queueOrderPrevValue: RedisOrdersQueueOrderType = JSON.parse(
		await RedisService.redis.hget(
			`tables:orders:${orderRecord.table.id}`,
			String(orderRecord.id)
		)
	);
	const queueOrderNewValue: RedisOrdersQueueOrderType = {
		...queueOrderPrevValue,
		status,
	};
	await RedisService.redis.hset(
		`orders`,
		orderRecord.id,
		JSON.stringify(queueOrderNewValue)
	);
};

const getTodayOrders = async () => {
	const _todayOrders: { [hash: string]: string } =
		await RedisService.redis.hgetall("orders");

	const todayOrders = Object.values(_todayOrders)
		.map((value): RedisOrdersQueueOrderType => JSON.parse(value))
		.sort((a, b) => a.id - b.id);

	return todayOrders;
};

const getOrdersHistory = async () => {
	const orders = await AppDataSource.createQueryBuilder()
		.from(Order, "order")
		.addSelect(["order.date", "order.total", "order.id"])
		.leftJoin("order.orderDishes", "order_dish")
		.addSelect(["order_dish.quantity"])
		.leftJoin("order_dish.dish", "dish")
		.addSelect(["dish.name", "dish.price", "dish.description"])
		.leftJoin("dish.category", "category")
		.addSelect(["category.name"])
		.leftJoin("dish.dishIngredients", "dish_ingredient")
		.addSelect(["dish_ingredient.amount"])
		.leftJoin("dish_ingredient.ingredient", "ingredient")
		.addSelect(["ingredient.name"])
		.orderBy("order.date", "DESC")
		.getMany();
	return orders;
};

const cancelOrder = async (orderId: number) => {
	const ordersRepo = AppDataSource.getRepository(Order);
	const orderRecord = await ordersRepo.findOneBy({ id: orderId });
	if (!orderRecord) {
		throw new NotFoundError("order with this id was not found");
	}
	await ordersRepo.delete(orderRecord);
};

export const OrdersService = {
	createNewOrder,
	orderBelongsToTable,
	updateOrder,
	updateOrderStatus,
	getTodayOrders,
	getOrdersHistory,
	cancelOrder,
};

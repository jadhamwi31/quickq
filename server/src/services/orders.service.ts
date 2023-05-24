import moment from "moment";
import { Between } from "typeorm";
import { AppDataSource } from "../models";
import { Dish } from "../models/dish.model";
import { BadRequestError, NotFoundError } from "../models/error.model";
import { Order } from "../models/order.model";
import { Payment } from "../models/payment.model";
import { OrderDish } from "../models/shared.model";
import { Table } from "../models/table.model";
import { IRedisTableOrder } from "../ts/interfaces/order.interfaces";
import {
	OrderDishesType,
	OrderStatusType,
	RedisOrderDish,
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

	if (tableRecord.status === "Available") {
		throw new BadRequestError("open table before start ordering");
	}

	const clientId = await RedisService.redis.hget(
		"tables:sessions",
		String(tableId)
	);

	const order = new Order();
	const payment = await paymentsRepo.findOneBy({
		clientId,
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

	const redisTableOrder: IRedisTableOrder = {
		id: order.id,
		dishes: order.orderDishes.map(
			(orderDish): RedisOrderDish => ({
				id: orderDish.dish.id,
				name: orderDish.dish.name,
				quantity: orderDish.quantity,
			})
		),
		status: "Pending",
	};
	await RedisService.redis.hset(
		"orders",
		redisTableOrder.id,
		JSON.stringify(redisTableOrder)
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
	const dishesRepo = AppDataSource.getRepository(Dish);
	const orderDishesRecords = await ordersDishesRepo.find({
		relations: { dish: true, order: true },
		where: { order: { id: orderId } },
	});
	if (!orderDishesRecords) {
		throw new NotFoundError("order with this id was not found");
	}

	for (const dish of dishes) {
		const dishRecord = await dishesRepo.findOneBy({ name: dish.name });
		if (!dishRecord) {
			throw new NotFoundError(`dish ${dish.name} not found`);
		}
		const index = orderDishesRecords.findIndex(
			(current) => current.dish.name === dish.name
		);
		if (index >= 0) {
			orderDishesRecords[index].quantity = dish.quantity;
		} else {
			throw new BadRequestError(`you didn't order ${dish.name}`);
		}
	}

	await ordersDishesRepo.save(orderDishesRecords);

	const newRedisOrder: IRedisTableOrder = JSON.parse(
		await RedisService.redis.hget("orders", String(orderId))
	);

	newRedisOrder.dishes = orderDishesRecords.map(
		(orderDish): RedisOrderDish => ({
			id: orderDish.id,
			quantity: orderDish.quantity,
			name: orderDish.dish.name,
		})
	);

	await RedisService.redis.hset(
		"orders",
		orderId,
		JSON.stringify(newRedisOrder)
	);
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

	const newRedisOrder: IRedisTableOrder = JSON.parse(
		await RedisService.redis.hget("orders", String(orderId))
	);
	newRedisOrder.status = status;

	await RedisService.redis.hset(
		"orders",
		orderId,
		JSON.stringify(newRedisOrder)
	);
};

const getTodayOrders = async () => {
	const ordersCacheHit = await RedisService.redis.exists("orders");
	if (!ordersCacheHit) {
		const dayStart = moment().startOf("day").toDate();
		const dayEnd = moment().endOf("day").toDate();
		const _orders = await AppDataSource.createQueryBuilder()
			.from(Order, "order")
			.addSelect(["order.id", "order.status"])
			.leftJoin("order.orderDishes", "order_dish")
			.addSelect(["order_dish.quantity"])
			.leftJoin("order_dish.dish", "dish")
			.addSelect(["dish.name", "dish.price"])
			.where({ date: Between(dayStart, dayEnd) })
			.orderBy("order.date", "DESC")
			.getMany();

		const orders: IRedisTableOrder[] = [];
		for (const order of _orders) {
			const orderObject: IRedisTableOrder = {
				id: order.id,
				status: order.status,
				dishes: order.orderDishes.map(
					(orderDish): RedisOrderDish => ({
						name: orderDish.dish.name,
						quantity: orderDish.quantity,

						id: orderDish.dish.id,
					})
				),
			};
			orders.push(orderObject);
			await RedisService.redis.hset(
				"orders",
				order.id,
				JSON.stringify(orderObject)
			);
		}

		return orders;
	} else {
		const _todayOrders = Object.values(
			await RedisService.redis.hgetall("orders")
		).map((order): IRedisTableOrder => JSON.parse(order));
		const _todayOrdersSorted = _todayOrders.sort((a, b) => b.id - a.id);
		return _todayOrdersSorted;
	}
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

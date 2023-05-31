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
import { TablesService } from "./tables.service";

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

	const clientId = await TablesService.getTableSessionClientId(tableId);

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
	await ordersRepo.save(order);
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

		await ordersDishesRepo.save(newOrderDish);

		order.orderDishes.push(newOrderDish);
	}
	await ordersRepo.save(order);

	const redisTableOrder: IRedisTableOrder = {
		id: order.id,
		tableId: tableRecord.id,
		total: order.total,
		date: order.date.toString(),
		dishes: order.orderDishes.map(
			(orderDish): RedisOrderDish => ({
				id: orderDish.dish.id,
				name: orderDish.dish.name,
				quantity: orderDish.quantity,
				price: orderDish.dish.price,
			})
		),
		status: "Pending",
	};

	// Update Orders In Cache
	await RedisService.redis.hset(
		"orders",
		redisTableOrder.id,
		JSON.stringify(redisTableOrder)
	);
};

const orderBelongsToTable = async (orderId: number, tableId: number) => {
	const orders = await getTodayOrders();

	const order = orders.find((order) => order.id == orderId);

	if (order) {
		if (order.tableId == tableId) {
			return true;
		} else {
			return false;
		}
	} else {
		throw new NotFoundError("order with this id was not found");
	}
};

const updateOrder = async (
	orderId: number,
	dishesToMutate: OrderDishesType,
	dishesToRemove: OrderDishesType
) => {
	const ordersDishesRepo = AppDataSource.getRepository(OrderDish);
	const dishesRepo = AppDataSource.getRepository(Dish);
	const orderDishesRecords = await ordersDishesRepo.find({
		relations: { dish: true, order: true },
		where: { order: { id: orderId } },
	});

	if (dishesToMutate)
		for (const dish of dishesToMutate) {
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
	if (dishesToRemove)
		for (const dish of dishesToRemove) {
			const index = orderDishesRecords.findIndex(
				(current) => current.dish.name === dish.name
			);
			if (index >= 0) {
				orderDishesRecords.splice(index, 1);
			} else {
				throw new BadRequestError(`you didn't order ${dish.name}`);
			}
		}

	await ordersDishesRepo.save(orderDishesRecords);

	const isOrderCached = await RedisService.isCached("orders", String(orderId));
	if (isOrderCached) {
		const redisCachedOrder: IRedisTableOrder = JSON.parse(
			await RedisService.getCachedVersion("orders", String(orderId))
		);

		redisCachedOrder.dishes = orderDishesRecords.map(
			(orderDish): RedisOrderDish => ({
				id: orderDish.id,
				quantity: orderDish.quantity,
				name: orderDish.dish.name,
				price: orderDish.dish.price,
			})
		);

		// Update Order In Cache
		await RedisService.redis.hset(
			"orders",
			orderId,
			JSON.stringify(redisCachedOrder)
		);
	} else {
		const orders = await getTodayOrders();
		const currentOrder = orders.find((order) => order.id == orderId);
		currentOrder.dishes = orderDishesRecords.map(
			(orderDish): RedisOrderDish => ({
				id: orderDish.id,
				quantity: orderDish.quantity,
				name: orderDish.dish.name,
				price: orderDish.dish.price,
			})
		);

		// Update Order In Cache
		await RedisService.redis.hset(
			"orders",
			orderId,
			JSON.stringify(currentOrder)
		);
	}
};

const updateOrderStatus = async (orderId: number, status: OrderStatusType) => {
	const ordersRepo = AppDataSource.getRepository(Order);

	const orderRecord = await ordersRepo.findOne({
		where: { id: orderId },
		relations: { table: true },
	});
	orderRecord.status = status;
	await ordersRepo.save(orderRecord);

	// Update Order Status In Cache
	const isOrderCached = await RedisService.isCached("orders", String(orderId));
	if (isOrderCached) {
		const newRedisOrder: IRedisTableOrder = JSON.parse(
			await RedisService.redis.hget("orders", String(orderId))
		);
		newRedisOrder.status = status;

		await RedisService.redis.hset(
			"orders",
			orderId,
			JSON.stringify(newRedisOrder)
		);
	} else {
		const orders = await getTodayOrders();
		const currentOrder = orders.find((order) => order.id == orderId);
		currentOrder.status = status;
		await RedisService.redis.hset(
			"orders",
			orderId,
			JSON.stringify(currentOrder)
		);
	}
};

const getTodayOrders = async () => {
	const areOrdersCached = await RedisService.isCached("orders");
	if (areOrdersCached) {
		const _todayOrders = Object.values(
			await RedisService.redis.hgetall("orders")
		).map((order): IRedisTableOrder => JSON.parse(order));
		const _todayOrdersSorted = _todayOrders.sort((a, b) => b.id - a.id);
		return _todayOrdersSorted;
	} else {
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
		const redisOrdersToSet: { [orderId: string]: string } = {};
		// Transform Orders To Redis Order Structure
		for (const order of _orders) {
			const orderObject: IRedisTableOrder = {
				id: order.id,
				tableId: order.table.id,
				status: order.status,
				total: order.total,
				date: order.date.toString(),
				dishes: order.orderDishes.map(
					(orderDish): RedisOrderDish => ({
						name: orderDish.dish.name,
						quantity: orderDish.quantity,
						price: orderDish.dish.price,
						id: orderDish.dish.id,
					})
				),
			};
			orders.push(orderObject);
			redisOrdersToSet[order.id] = JSON.stringify(orderObject);
		}
		// Update Orders In Redis
		await RedisService.redis.hmset("orders", redisOrdersToSet);

		return orders;
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
	await ordersRepo.remove(orderRecord);
	await RedisService.redis.hdel("orders", String(orderId));
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

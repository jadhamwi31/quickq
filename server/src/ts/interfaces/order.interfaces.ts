import { OrderStatusType, RedisOrderDish } from "../types/order.types";

export interface IOrderDish {
	name: string;
	quantity: number;
	price: number;
}

export type OrderDishType<T extends keyof IOrderDish = keyof IOrderDish> = Pick<
	IOrderDish,
	T
>;

export interface IRedisTableOrder {
	id: number;
	dishes: RedisOrderDish[];
	status: OrderStatusType;
	tableId: number;
	total: number;
	date: string;
}

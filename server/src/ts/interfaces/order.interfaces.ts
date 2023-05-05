import { OrderStatusType, RedisOrderDish } from "../types/order.types";

export interface IOrderDish {
	name: string;
	quantity: number;
}

export interface IRedisTableOrder {
	id: number;
	dishes: RedisOrderDish[];
	status: OrderStatusType;
}

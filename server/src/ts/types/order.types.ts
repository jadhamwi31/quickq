import { Dish } from "../../models/dish.model";
import { IRedisTableOrder } from "../interfaces/order.interfaces";

export type OrderStatusType = "Pending" | "In Cook" | "Ready" | "Cancelled";
export interface IOrderDish {
	name: string;
	quantity: number;
	price: number;
}

export type OrderDishType<T extends keyof IOrderDish = keyof IOrderDish> = Pick<
	IOrderDish,
	T
>;
export type OrderDishesType<T extends keyof IOrderDish = keyof IOrderDish> =
	OrderDishType<T>[];

export type NewOrderType = { dishes: OrderDishesType; tableId: number };
export type UpdateOrderType = {
	dishesToMutate: OrderDishesType;
	dishesToRemove: OrderDishesType;
};

export type UpdateOrderStatusType = {
	status: OrderStatusType;
};

export type RedisOrdersQueueOrderType = IRedisTableOrder & { table_id: number };

export type RedisOrderDish = IOrderDish & Pick<Dish, "id">;

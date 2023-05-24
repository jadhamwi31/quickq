import { Dish } from "../../models/dish.model";
import { IOrderDish, IRedisTableOrder } from "../interfaces/order.interfaces";

export type OrderStatusType = "Pending" | "In Cook" | "Done";

export type OrderDishesType = IOrderDish[];

export type NewOrderType = { dishes: OrderDishesType; tableId: number };
export type UpdateOrderType = {
	dishes: OrderDishesType;
};

export type UpdateOrderStatusType = {
	status: OrderStatusType;
};

export type RedisOrdersQueueOrderType = IRedisTableOrder & { table_id: number };

export type RedisOrderDish = IOrderDish & Pick<Dish, "id">;

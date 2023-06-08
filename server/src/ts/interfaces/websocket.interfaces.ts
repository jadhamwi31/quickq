import { Order } from "../../models/order.model";
import { OrderStatusType, RedisOrderDish } from "../types/order.types";
import { TableStatus } from "../types/table.types";
import { IRedisTableOrder } from "./order.interfaces";

export interface IServerToClientEvents {
	update_table_status: (tableId: number, tableStatus: TableStatus) => void;
	update_order_status: (orderId: number, orderStatus: OrderStatusType) => void;
	update_order_dishes: (orderId: number, newDishes: RedisOrderDish[]) => void;
	new_order: (order: IRedisTableOrder) => void;
	increment_payins: (by: number) => void;
	inventory_item_update: (
		item: string,
		update: { available?: number; needed?: number }
	) => void;
	checkout_request: (tableId: number) => void;
}

export interface IClientToServerEvents {
	checkout_finished: (tableId: number) => void;
}

export interface InterServerEvents {}

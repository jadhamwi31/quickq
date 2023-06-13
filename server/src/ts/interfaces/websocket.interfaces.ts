import { OrderDishesType, OrderStatusType } from "../types/order.types";
import { TableStatus } from "../types/table.types";

export interface IServerToClientEvents {
	update_table_status: (tableId: number, status: TableStatus) => void;
	update_order_status: (orderId: number, status: OrderStatusType) => void;
	update_order: (
		orderId: number,
		update: {
			dishesToMutate?: OrderDishesType<"name" | "quantity">;
			dishesToRemove?: OrderDishesType<"name">;
		}
	) => void;
	update_inventory_item: (
		ingredientName: string,
		update: Partial<{ available: number; needed: number }>
	) => void;
	increment_payins: (amount: number) => void;
	authorized: (msg: string) => void;
	notification: (title: string, content: string) => void;
}

export interface IClientToServerEvents {
	request_checkout: (tableId: number) => void;
}

export interface InterServerEvents {}

import { OrderStatusType } from "../types/order.types";
import { TableStatus } from "../types/table.types";

export interface IServerToClientEvents {
	update_table_status: (tableId: number, tableStatus: TableStatus) => void;
	update_order_status: (orderId: number, orderStatus: OrderStatusType) => void;
}

export interface IClientToServerEvents {
	checkoutFinished: () => void;
}

export interface InterServerEvents {}

import { IOrderDish } from "../interfaces/order.interfaces";

export type OrderStatusType = "Pending" | "In Cook" | "Done";

export type OrderDishesType = IOrderDish[];

export type NewOrderType = { dishes: OrderDishesType; tableId: number };

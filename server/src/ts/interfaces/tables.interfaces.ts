import { TableStatus as TableStatusType } from "../types/table.types";

export interface IRedisTableValue {
	paymentId: string;
	status: TableStatusType;
}

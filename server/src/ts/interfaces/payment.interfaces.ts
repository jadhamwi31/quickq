export interface INewPayment {
	tableId: number;
	amountPaid: number;
}

export interface IRedisPayment {
	date: string;
	amount: number;
	tableId: number;
}

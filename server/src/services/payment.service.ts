import moment from "moment";
import {Between} from "typeorm";
import {AppDataSource} from "../models";
import {BadRequestError, ForbiddenError} from "../models/error.model";
import {Payment} from "../models/payment.model";
import {Table, TableSession} from "../models/table.model";
import {IRedisTableOrder} from "../ts/interfaces/order.interfaces";
import {IRedisPayment} from "../ts/interfaces/payment.interfaces";
import RedisService from "./redis.service";
import {TablesService} from "./tables.service";
import WebsocketService from "./websocket.service";
import {OrdersService} from "./orders.service";

const newPayment = async (tableId: number, amountPaid: number) => {
    const {total,receipt} = await TablesService.checkoutTable(tableId);
    const clientId = await TablesService.getTableSessionClientId(tableId);
    const tablesRepo = AppDataSource.getRepository(Table);
    const table = await tablesRepo.findOneBy({id: tableId})
    if (total !== amountPaid) {
        throw new ForbiddenError(`amount paid not equel to check total ${total}`);
    }

    receipt.forEach((tableOrder) => {
        if (tableOrder.status === "Pending" || tableOrder.status === "In Cook") {
            throw new BadRequestError("pending/in-cook orders still present");
        }
    });

    const paymentsRepo = AppDataSource.getRepository(Payment);
    const payment = await paymentsRepo.findOneBy({clientId});
    if (payment) {
        payment.date = new Date();
        payment.amount = amountPaid;
        payment.table = table
        await paymentsRepo.save(payment);
    } else {
        throw new BadRequestError("no payment for this table right now");
    }

    await TablesService.closeTableSession(tableId,true)
    // Table Orders
    const redisTablesOrders = await OrdersService.getTodayOrders();

    // Clear Table Orders From Cache
    for (const order of redisTablesOrders) {
        if (order.tableId == tableId) {
            await RedisService.redis.hdel("orders", String(order.id));
        }
    }

    // Previous Cache Values
    const areTransactionsCached = await RedisService.isCached("payments", "transactions")

    const prevTransactions: Payment[] = JSON.parse(
        await RedisService.redis.hget("payments", "transactions")
    );
    const prevPayins = await RedisService.redis.hget("payments", "payins");

    // Update Trasanctions In Cache
    if (areTransactionsCached) {

        await RedisService.redis.hset(
            "payments",
            "transactions",
            JSON.stringify([
                ...prevTransactions,
                {
                    date: payment.date.toString(),
                    amount: payment.amount,
                    tableId,
                } as IRedisPayment,
            ])
        );
    } else {
        await RedisService.redis.hset(
            "payments",
            "transactions",
            JSON.stringify([

                {
                    date: payment.date.toString(),
                    amount: payment.amount,
                    tableId,
                } as IRedisPayment,
            ])
        );
    }
    // Update Payins In Cache
    await RedisService.redis.hset(
        "payments",
        "payins",
        Number(prevPayins) + payment.amount
    );



    // Update Table Status
    const tableRecord = await tablesRepo.findOneBy({id: tableId});
    tableRecord.status = "Available";
    await tablesRepo.save(tableRecord);
    WebsocketService.publishEvent(
        ["manager", "cashier", "chef"],
        "notification",
        `Table Status Update | Table Number : ${tableId}`,
        `Available`
    );
    WebsocketService.publishEvent(
        ["manager", "chef", "cashier"],
        "update_table_status",
        tableRecord.id,
        "Available"
    );
    WebsocketService.publishEvent(
        ["manager", "cashier"],
        "increment_payins",
        amountPaid
    );
    WebsocketService.publishEvent(["manager","cashier"],"new_payment",{amount:payment.amount,tableId:payment.table.id,date:payment.date.toString(),clientId:payment.clientId})
};

const getPaymentsHistory = async () => {

    const payments = await AppDataSource.createQueryBuilder()
        .from(Payment, "payment")
        .addSelect(["payment.date", "payment.amount"])
        .leftJoin("payment.orders", "order")
        .getMany();

    return {payments,total:payments.reduce((total,current) => total + current.amount,0)}
};

const getTodayPayments = async () => {
    const arePaymentsCached = await RedisService.isCached("payments");
    if (arePaymentsCached) {
        RedisService.cacheLog("payments")
        const transactions = JSON.parse(
            await RedisService.getCachedVersion("payments", "transactions")
        );
        const payins = Number(
            await RedisService.getCachedVersion("payments", "payins")
        );
        return {
            transactions,
            payins,
        };
    } else {
        const dayStart = moment().startOf("day").toDate();
        const dayEnd = moment().endOf("day").toDate();

        const _transactions = await AppDataSource.getRepository(Payment).find({
            where: {date: Between(dayStart, dayEnd)}, relations: {table: true},
            select: ["date", "amount", "clientId", "table"],
        });
        console.log(_transactions)

        const transactions = _transactions.map((transaction) => {
            const tableId = transaction.table.id;
            delete transaction.table;
            return {...transaction, tableId}
        })
        console.log(transactions)


        const payins = transactions.reduce(
            (prev, current) => prev + current.amount,
            0
        );

        // Update Payments in Cache
        await RedisService.redis.hset(
            "payments",
            "transactions",
            JSON.stringify(transactions)
        );
        await RedisService.redis.hset("payments", "payins", payins);
        return {
            transactions,
            payins,
        };
    }
};

export const PaymentService = {
    newPayment,
    getPaymentsHistory,
    getTodayPayments,
};

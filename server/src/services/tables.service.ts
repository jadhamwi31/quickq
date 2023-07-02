import {v4 as uuid} from "uuid";
import {AppDataSource} from "../models";
import {BadRequestError, ConflictError, NotFoundError,} from "../models/error.model";
import {Payment} from "../models/payment.model";
import {Table, TableCode, TableSession} from "../models/table.model";
import {TableStatus} from "../ts/types/table.types";
import RedisService from "./redis.service";
import {OrdersService} from "./orders.service";
import {UserRoleType} from "../ts/types/user.types";
import WebsocketService from "./websocket.service";
import {Order} from "../models/order.model";

const getTableSessionClientId = async (tableId: number) => {
    const isTableSessionCached = await RedisService.isCached(
        "tables:sessions",
        String(tableId)
    );
    if (isTableSessionCached) {
        const clientId = await RedisService.getCachedVersion(
            "tables:sessions",
            String(tableId)
        );


        return clientId;
    } else {
        const tableSession = await AppDataSource.getRepository(
            TableSession
        ).findOne({
            relations: {table: true},
            where: {table: {id: tableId}},
        });

        if (tableSession.clientId) {
            await RedisService.redis.hset(
                "tables:sessions",
                String(tableId),
                tableSession.clientId
            );
            return tableSession.clientId;
        }
        throw new BadRequestError("open table session first");
    }
};

const createNewTable = async (id: number) => {
    const tablesRepo = AppDataSource.getRepository(Table);
    const tablesCodesRepo = AppDataSource.getRepository(TableCode);
    const tablesSessionsRepo = AppDataSource.getRepository(TableSession);
    const tableExists = await tablesRepo.findOneBy({id});
    if (tableExists) {
        throw new ConflictError("table with this id already exists");
    }
    const tableRecord = new Table();
    const tableCodeRecord = new TableCode();
    const tableSession = new TableSession();
    try {
        tableRecord.id = id;
        tableRecord.status = "Available";

        await tablesRepo.save(tableRecord);
        tableCodeRecord.code = uuid();
        tableCodeRecord.table = tableRecord;

        await tablesCodesRepo.save(tableCodeRecord);
        tableSession.table = tableRecord;

        await tablesSessionsRepo.save(tableSession);

        return tableCodeRecord.code;
    } catch (e) {
        await tablesRepo.remove(tableRecord);
        await tablesCodesRepo.remove(tableCodeRecord);
        await tablesSessionsRepo.remove(tableSession);
    }
};


const deleteTable = async (id: number) => {
    const tablesRepo = AppDataSource.getRepository(Table);

    const tableRecord = await tablesRepo.findOneBy({id});
    if (!tableRecord) {
        throw new NotFoundError("table with this id doesn't exist");
    }

    await tablesRepo.remove(tableRecord);
};

const getTables = async (role: UserRoleType) => {
    const tablesCodesRepo = AppDataSource.getRepository(TableCode);

    const tablesCodes = await tablesCodesRepo.find({
        relations: {table: true},
        select: ["table", "code"],
    });

    return tablesCodes.map((tableCode) => ({
        code: role === "manager" ? tableCode.code : undefined,
        id: tableCode.table.id,
        status: tableCode.table.status,
    }));
};

const openNewTableSession = async (tableId: number, clientId: string) => {
    const paymentsRepo = AppDataSource.getRepository(Payment);
    const tablesRepo = AppDataSource.getRepository(Table);
    const table = await tablesRepo.findOneBy({id: tableId});
    const prevStatus = table.status;
    if (table.status === "Busy") {
        throw new BadRequestError("table is busy");
    }
    const payment = new Payment();
    table.status = "Busy";
    payment.clientId = clientId;
    await paymentsRepo.save(payment);
    await tablesRepo.save(table);

    const tablesSessionsRepo = AppDataSource.getRepository(TableSession);
    const tableSessionRecord = await tablesSessionsRepo.findOne({
        relations: {table: true},
        where: {table: {id: tableId}},
    });
    tableSessionRecord.clientId = clientId;
    await tablesSessionsRepo.save(tableSessionRecord);
    await RedisService.redis.hset("tables:sessions", String(tableId), clientId);
    if(prevStatus === "Available"){

    WebsocketService.publishEvent(
        ["manager", "cashier", "chef"],
        "update_table_status",
        Number(tableId),
        "Busy"
    );
    WebsocketService.publishEvent(
        ["manager", "cashier", "chef"],
        "notification",
        `Table Status Update | Table Number : ${tableId}`,
        "Busy"
    );
    }
};

const closeTableSession = async (tableId: number, fromPayment = false) => {

    const tablesRepo = AppDataSource.getRepository(Table);
    const table = await tablesRepo.findOneBy({id: tableId});

    const prevStatus = table.status;
    const clientOrders = await OrdersService.getTableOrders(tableId)
    if (!fromPayment && clientOrders.length !== 0) {
        throw new BadRequestError("table has to pay before closing")
    }
    table.status = "Available";
    await tablesRepo.save(table);

    const tablesSessionsRepo = AppDataSource.getRepository(TableSession);
    const tableSessionRecord = await tablesSessionsRepo.findOne({
        relations: {table: true},
        where: {table: {id: tableId}},
    });
    tableSessionRecord.clientId = null;
    await tablesSessionsRepo.save(tableSessionRecord);
    await RedisService.redis.hdel("tables:sessions", String(tableId));
    if(prevStatus === "Busy"){

    WebsocketService.publishEvent(
        ["manager", "cashier", "chef"],
        "update_table_status",
        Number(tableId),
        "Available"
    );
    WebsocketService.publishEvent(
        ["manager", "cashier", "chef"],
        "notification",
        `Table Status Update | Table Number : ${tableId}`,
        "Available"
    );
    }
};

const checkoutTable = async (tableId: number) => {



    const tableOrders = (await OrdersService.getTableOrders(tableId)).filter((order) => order.status !== "Cancelled")

    const total = tableOrders.reduce(
        (total, current) => total + current.total,
        0
    );
    console.log(tableOrders,total)


    return {receipt: tableOrders, total};
};

export const TablesService = {
    createNewTable,
    deleteTable,
    getTables,
    openNewTableSession,
    checkoutTable,
    getTableSessionClientId,
    closeTableSession,
};

import moment from "moment";
import {Between} from "typeorm";
import {AppDataSource} from "../models";
import {Dish} from "../models/dish.model";
import {BadRequestError, NotFoundError} from "../models/error.model";
import {Order} from "../models/order.model";
import {Payment} from "../models/payment.model";
import {OrderDish} from "../models/shared.model";
import {Table} from "../models/table.model";
import {IRedisTableOrder} from "../ts/interfaces/order.interfaces";
import {OrderDishesType, OrderStatusType, RedisOrderDish,} from "../ts/types/order.types";
import RedisService from "./redis.service";
import {TablesService} from "./tables.service";
import WebsocketService from "./websocket.service";
import {isEmpty} from "lodash";

const createNewOrder = async (newOrder: OrderDishesType, tableId: number) => {
    const dishesRepo = AppDataSource.getRepository(Dish);
    const tablesRepo = AppDataSource.getRepository(Table);
    const ordersRepo = AppDataSource.getRepository(Order);
    const paymentsRepo = AppDataSource.getRepository(Payment);
    const ordersDishesRepo = AppDataSource.getRepository(OrderDish);

    const tableRecord = await tablesRepo.findOneBy({id: tableId});
    if (!tableRecord) {
        throw new NotFoundError(`table with id ${tableId} doesn't exist`);
    }

    if (tableRecord.status === "Available") {
        throw new BadRequestError("open table before start ordering");
    }

    const clientId = await TablesService.getTableSessionClientId(tableId);

    const order = new Order();
    const payment = await paymentsRepo.findOneBy({
        clientId,
    });
    order.payment = payment;
    order.table = tableRecord;
    order.orderDishes = [];
    order.status = "Pending";
    order.total = 0;
    order.orderDishes = [];

    await ordersRepo.save(order);
    for (const orderDish of newOrder) {
        const dishRecord = await dishesRepo.findOneBy({name: orderDish.name});
        if (!dishRecord) {
            throw new NotFoundError(`${orderDish.name}: not found`);
        }
        order.total += Number(dishRecord.price) * orderDish.quantity;
        const newOrderDish = new OrderDish();
        newOrderDish.order = order;
        newOrderDish.dish = dishRecord;
        newOrderDish.quantity = orderDish.quantity;
        newOrderDish.price = dishRecord.price;

        await ordersDishesRepo.save(newOrderDish);

        order.orderDishes.push(newOrderDish);
    }
    await ordersRepo.save(order);

    const redisTableOrder: IRedisTableOrder = {
        id: order.id,
        tableId: tableRecord.id,
        total: order.total,
        date: order.date.toString(),
        dishes: order.orderDishes.map(
            (orderDish): RedisOrderDish => ({
                id: orderDish.dish.id,
                name: orderDish.dish.name,
                quantity: orderDish.quantity,
                price: orderDish.dish.price,
            })
        ),
        status: "Pending",
    };

    // Update Orders In Cache
    await RedisService.redis.hset(
        "orders",
        String(redisTableOrder.id),
        JSON.stringify(redisTableOrder)
    );

    // Clear Predictions From Cache
    await RedisService.redis.del("prices:predictions")


    await WebsocketService.publishEvent(["cashier", "chef", "manager"], "new_order", redisTableOrder);
    await WebsocketService.publishEvent(["cashier", "chef", "manager"], "notification", "New Order", `New Order | ID : ${redisTableOrder.id} | Table : ${redisTableOrder.tableId}`);

};

const orderBelongsToTable = async (orderId: number, tableId: number) => {
    const orders = await getTodayOrders();

    const order = orders.find((order) => order.id == orderId);

    if (order) {
        if (order.tableId == tableId) {
            return true;
        } else {
            return false;
        }
    } else {
        throw new NotFoundError("order with this id was not found");
    }
};

const updateOrder = async (
    orderId: number,
    dishesToMutate: OrderDishesType<"name" | "quantity">,
    dishesToRemove: OrderDishesType<"name">
) => {
    const ordersRepo = AppDataSource.getRepository(Order);
    const orderRecord = await ordersRepo.findOneBy({id: orderId});
    if (!orderRecord) {
        throw new NotFoundError("order with this id doesn't exist");
    }
    const ordersDishesRepo = AppDataSource.getRepository(OrderDish);
    const dishesRepo = AppDataSource.getRepository(Dish);
    const orderDishesRecords = await ordersDishesRepo.find({
        relations: {dish: true, order: true},
        where: {order: {id: orderId}},
    });

    if (dishesToMutate)
        for (const dish of dishesToMutate) {
            const dishRecord = await dishesRepo.findOneBy({name: dish.name});
            if (!dishRecord) {
                throw new NotFoundError(`dish ${dish.name} not found`);
            }
            const index = orderDishesRecords.findIndex(
                (current) => current.dish.name === dish.name
            );
            if (index >= 0) {
                orderDishesRecords[index].quantity = dish.quantity;
            } else {
                throw new BadRequestError(`you didn't order ${dish.name}`);
            }
        }
    if (dishesToRemove)
        for (const dish of dishesToRemove) {
            const index = orderDishesRecords.findIndex(
                (current) => current.dish.name === dish.name
            );
            if (index >= 0) {
                orderDishesRecords.splice(index, 1);
            } else {
                throw new BadRequestError(`you didn't order ${dish.name}`);
            }
        }

    await ordersDishesRepo.save(orderDishesRecords);
    const orders = await getTodayOrders();
    const currentOrder = orders.find((order) => order.id == orderId);
    if (dishesToMutate || dishesToRemove) {

        WebsocketService.publishEvent(
            ["chef", "manager", String(orderRecord.table.id), "cashier"],
            "update_order",
            orderId,
            {dishesToMutate, dishesToRemove}
        );
        const MutatedDishesStr = dishesToMutate.map((dish) => `${dish.name} : ${dish.quantity}`).join("\n")
        const RemovedDishesStr = dishesToRemove.map((dish) => `${dish.name}`).join("\n")
        WebsocketService.publishEvent(
            ["chef"],
            "notification",
            "Order Update",
            `Dishes Modified :\n${MutatedDishesStr}\nDishes Removed :\n${RemovedDishesStr}`
        );
    }

    currentOrder.dishes = orderDishesRecords.map(
        (orderDish): RedisOrderDish => ({
            id: orderDish.id,
            quantity: orderDish.quantity,
            name: orderDish.dish.name,
            price: orderDish.dish.price,
        })
    );

    // Update Order In Cache
    await RedisService.redis.hset(
        "orders",
        String(orderId),
        JSON.stringify(currentOrder)
    );
};

const updateOrderStatus = async (orderId: number, status: OrderStatusType) => {
    const ordersRepo = AppDataSource.getRepository(Order);

    const orderRecord = await ordersRepo.findOne({
        where: {id: orderId},
        relations: {table: true},
    });
    if (!orderRecord) {
        throw new NotFoundError("order with this id doesn't exist");
    }

    if (orderRecord.status !== "Pending" && status === "Cancelled") {
        throw new BadRequestError("you can cancel only a pending order");
    }
    orderRecord.status = status;
    WebsocketService.publishEvent(
        [String(orderRecord.table.id), "manager", "cashier", "chef"],
        "update_order_status",
        orderRecord.id,
        status
    );
    WebsocketService.publishEvent(
        [String(orderRecord.table.id), "manager", "cashier", "chef"],
        "notification",
        "Order Status Update",
        `Order : ${orderRecord.id} | ${orderRecord.status}`
    );
    await ordersRepo.save(orderRecord);

    // Update Order Status In Cache
    const isOrderCached = await RedisService.isCached("orders", String(orderId));
    if (isOrderCached) {
        RedisService.cacheLog("orders", String(orderId))
        const newRedisOrder: IRedisTableOrder = JSON.parse(
            await RedisService.redis.hget("orders", String(orderId))
        );
        newRedisOrder.status = status;
        if(newRedisOrder.status === "Cancelled"){
            newRedisOrder.total = 0;
        }

        await RedisService.redis.hset(
            "orders",
            String(orderId),
            JSON.stringify(newRedisOrder)
        );
    } else {
        const orders = await getTodayOrders();
        const currentOrder = orders.find((order) => order.id == orderId);
        currentOrder.status = status;
        if(currentOrder.status === "Cancelled"){
            currentOrder.total = 0;
        }
        await RedisService.redis.hset(
            "orders",
            String(orderId),
            JSON.stringify(currentOrder)
        );
    }
};

const getTodayOrders = async () => {
    const areOrdersCached = await RedisService.isCached("orders");
    if (areOrdersCached) {
        RedisService.cacheLog("orders");
        const _todayOrders = Object.values(
            await RedisService.redis.hgetall("orders")
        ).map((order): IRedisTableOrder => JSON.parse(order));
        const _todayOrdersSorted = _todayOrders.sort((a, b) => b.id - a.id);
        return _todayOrdersSorted;
    } else {
        const dayStart = moment().startOf("day").toDate();
        const dayEnd = moment().endOf("day").toDate();
        const _orders = await AppDataSource.createQueryBuilder()
            .from(Order, "order")
            .addSelect(["order.id", "order.status", "order.date", "order.total"])
            .leftJoin("order.table", "table")
            .addSelect(["table.id"])
            .leftJoin("table.payments", "payment")
            .addSelect("payment.amount")
            .leftJoin("order.orderDishes", "order_dish")
            .addSelect(["order_dish.quantity"])
            .leftJoin("order_dish.dish", "dish")
            .addSelect(["dish.name", "dish.price"])
            .where({date: Between(dayStart, dayEnd)})
            .andWhere("payment.amount IS NULL")
            .orderBy("order.date", "DESC")
            .getMany();

        console.log(_orders)

        const orders: IRedisTableOrder[] = [];
        const redisOrdersToSet: { [orderId: string]: string } = {};
        // Transform Orders To Redis Order Structure
        for (const order of _orders) {
            const orderObject: IRedisTableOrder = {
                id: order.id,
                tableId: order.table.id,
                status: order.status,
                total: order.total,
                date: order.date.toString(),
                dishes: order.orderDishes.map(
                    (orderDish): RedisOrderDish => ({
                        name: orderDish.dish.name,
                        quantity: orderDish.quantity,
                        price: orderDish.dish.price,
                        id: orderDish.dish.id,
                    })
                ),
            };

            orders.push(orderObject);
            redisOrdersToSet[order.id] = JSON.stringify(orderObject);
        }
        if (!isEmpty(redisOrdersToSet)) {

            // Update Orders In Redis
            await RedisService.redis.hmset("orders", redisOrdersToSet);
        }

        return orders;
    }
};

const getOrdersHistory = async () => {
    const orders = await AppDataSource.createQueryBuilder()
        .from(Order, "order")
        .addSelect(["order.date", "order.total", "order.id"])
        .leftJoin("order.orderDishes", "order_dish")
        .addSelect(["order_dish.quantity"])
        .leftJoin("order_dish.dish", "dish")
        .addSelect(["dish.name", "dish.price", "dish.description"])
        .leftJoin("dish.category", "category")
        .addSelect(["category.name"])
        .leftJoin("dish.dishIngredients", "dish_ingredient")
        .addSelect(["dish_ingredient.amount"])
        .leftJoin("dish_ingredient.ingredient", "ingredient")
        .addSelect(["ingredient.name"])
        .orderBy("order.date", "DESC")
        .getMany();
    return orders;
};

const getTableOrders = async (tableId: number) => {
    const tableClientOrders = await getTodayOrders();

    return tableClientOrders.filter((order) => order.tableId == tableId)
}

export const OrdersService = {
    createNewOrder,
    orderBelongsToTable,
    updateOrder,
    updateOrderStatus,
    getTodayOrders,
    getOrdersHistory, getTableOrders
};

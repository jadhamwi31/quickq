import {AppDataSource} from "../models";
import {Payment} from "../models/payment.model";
import moment from "moment";
import {Dish} from "../models/dish.model";
import {Parser} from "json2csv";
import axios from "axios";
import {DishesService} from "./dishes.service";
import {InternalServerError} from "../models/error.model";
import RedisService from "./redis.service";


type TestData = {
    [date: string]: {
        item_id: number;
        price: number;
        item_count: number;
        date: string;
    }[]
}

interface IPredictedData {
    item_id: number,
    Actual: number,
    Predicted: number
}

interface IPredictedDataReformed {
    dish_name: string,
    actual_price: number,
    recommended_price: number
}

type PredictedData = IPredictedData[]

type PredictedPricesReformedType = IPredictedDataReformed[]

const dateFormat = "YYYY-MM-DD"

const getDishesSalesData = async () => {
    const payments = await AppDataSource.getRepository(Payment).find();

    const dates = [...new Set(payments.filter((payment) => payment.date).map((payment) => (
        moment(payment.date).format(dateFormat)
    )))]
    const dishes = await AppDataSource.getRepository(Dish).find({relations: {orderDishes: {order: true}}});
    const data: TestData = {}
    for (const date of dates) {
        data[date] = []
        for (const dish of dishes) {
            const dishInOrders = dish.orderDishes;
            let count = 0;
            let price = -1;
            for (const dishInOrder of dishInOrders) {

                if (moment(dishInOrder.date).format(dateFormat) === date && dishInOrder.order.status !== "Cancelled") {
                    count += dishInOrder.quantity;
                    price = dishInOrder.price;
                }
            }

            data[date].push({item_id: dish.id, item_count: count, date, price: price === -1 ? dish.price : price})
        }
    }
    const dataFlattened = Object.values(data).flat()
    console.log(dataFlattened)
    const parser = new Parser({fields: ["date", "item_id", "price", "item_count"], header: true})
    return parser.parse(dataFlattened)
}


const predictPrices = async (csv: string) => {

    try {
        const predictedPrices: PredictedData = (await axios.post("http://0.0.0.0:5000/predictions/prices", csv).then(({data}) => {
            return data;
        }))
        const predictedPricesReformed: PredictedPricesReformedType = [];
        for (const entry of predictedPrices) {
            try {
                const dish = await DishesService.getDishById(entry.item_id);
                predictedPricesReformed.push({
                    actual_price: entry.Actual,
                    recommended_price: entry.Predicted,
                    dish_name: dish.name
                })
            } catch (e) {

            }
        }
        return predictedPricesReformed;
    } catch (e) {
        throw new InternalServerError("can't predict at this moment, try again later")
    }
}

const getPricesPrediction = async () => {
    const predictionsCached = await RedisService.isCached("prices:predictions");
    if (predictionsCached) {

        return JSON.parse(await RedisService.getCachedVersion("prices:predictions"))
    } else {
        const dishesSales = await getDishesSalesData();

        const predictedPrices = await predictPrices(dishesSales);
        await RedisService.redis.set("prices:predictions", JSON.stringify(predictedPrices))
        return predictedPrices
    }

}

export const AiService = {
    getPricesPrediction,
}
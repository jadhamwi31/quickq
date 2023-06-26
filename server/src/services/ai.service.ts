import {AppDataSource} from "../models";
import {Payment} from "../models/payment.model";
import moment from "moment";
import {Dish} from "../models/dish.model";
import {Parser} from "json2csv";
import axios from "axios";
import {csv} from "../utils/temp";
import {DishesService} from "./dishes.service";


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

const getPricesTestData = async () => {
    const payments = await AppDataSource.getRepository(Payment).find();

    const dates = [...new Set(payments.filter((payment) => payment.date).map((payment) => (
        moment(payment.date).format(dateFormat)
    )))]
    const dishes = await AppDataSource.getRepository(Dish).find({relations: {orderDishes: true}});
    const data: TestData = {}
    for (const date of dates) {
        data[date] = []
        for (const dish of dishes) {
            const dishInOrders = dish.orderDishes;
            let count = 0;
            let price = -1;
            for (const dishInOrder of dishInOrders) {

                if (moment(dishInOrder.date).format(dateFormat) === date) {
                    count += dishInOrder.quantity;
                    price = dishInOrder.price;
                }
            }
            data[date].push({item_id: dish.id, item_count: count, date, price})
        }
    }
    const dataFlattened = Object.values(data).flat()
    const parser = new Parser({fields: ["date", "item_id", "price", "item_count"], header: true})

    return parser.parse(dataFlattened)
}


const predictPrices = async (_csv: string) => {
    try {
        const predictedPrices: PredictedData = await axios.post("http://0.0.0.0:5000/predictions/prices", csv).then(({data}) => {
            return data;
        })

        const predictedPricesReformed: PredictedPricesReformedType = [];
        for (const entry of predictedPrices) {
            try{

            const dish = await DishesService.getDishById(entry.item_id);
            predictedPricesReformed.push({
                actual_price: entry.Actual,
                recommended_price: entry.Predicted,
                dish_name: dish.name
            })
            }catch(e){
                predictedPricesReformed.push({
                    actual_price: entry.Actual,
                    recommended_price: entry.Predicted,
                    dish_name: "unknown"
                })
            }
        }
        return predictedPricesReformed;
    } catch (e) {
        console.log(e)
        return []
    }
}

const getPricesPrediction = async () => {
    const pricesTestData = await getPricesTestData();
    return await predictPrices(pricesTestData);
}

export const AiService = {
    getPricesPrediction,
}
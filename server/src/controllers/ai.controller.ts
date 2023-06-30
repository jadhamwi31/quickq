import {NextFunction, Request,Response} from "express";
import {AiService} from "../services/ai.service";


const predictPricesHandler = async(req:Request, res:Response, next:NextFunction) => {
    try{
        const predictedPrices = await AiService.getPricesPrediction();

        return res.status(200).send(predictedPrices)
    }catch(e){
        return next(e);
    }
}

export const AiController = {
     predictPricesHandler,
}
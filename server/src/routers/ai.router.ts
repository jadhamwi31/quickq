import {Router} from "express";
import {authFor} from "../middlewares/auth.middleware";
import {AiController} from "../controllers/ai.controller";


export const AiRouter = Router();



AiRouter.get("/predictions/prices",AiController.predictPricesHandler)

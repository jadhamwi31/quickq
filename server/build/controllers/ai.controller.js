"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const ai_service_1 = require("../services/ai.service");
const predictPricesHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const predictedPrices = yield ai_service_1.AiService.getPricesPrediction();
        return res.status(200).send(predictedPrices);
    }
    catch (e) {
        return next(e);
    }
});
exports.AiController = {
    predictPricesHandler,
};

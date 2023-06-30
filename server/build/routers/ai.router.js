"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRouter = void 0;
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
exports.AiRouter = (0, express_1.Router)();
exports.AiRouter.get("/predictions/prices", ai_controller_1.AiController.predictPricesHandler);

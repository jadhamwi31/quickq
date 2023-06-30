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
exports.DishesController = void 0;
const dishes_service_1 = require("../services/dishes.service");
const http_status_codes_1 = require("http-status-codes");
const createNewDishHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const dish = req.body;
    try {
        yield dishes_service_1.DishesService.createNewDish(dish);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "dish created" });
    }
    catch (e) {
        next(e);
    }
});
const deleteDishHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        yield dishes_service_1.DishesService.deleteDish(name);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "dish deleted" });
    }
    catch (e) {
        next(e);
    }
});
const getDishesHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dishes = yield dishes_service_1.DishesService.getDishes();
        return res.status(http_status_codes_1.StatusCodes.OK).send(dishes);
    }
    catch (e) {
        next(e);
    }
});
const getDishHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dish = yield dishes_service_1.DishesService.getDishById(req.params.id);
        return res.status(http_status_codes_1.StatusCodes.OK).send(dish);
    }
    catch (e) {
        return next(e);
    }
});
const updateDishHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const dish = req.body;
    const dishName = req.params.name;
    try {
        yield dishes_service_1.DishesService.updateDish(dishName, dish);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "dish updated" });
    }
    catch (e) {
        next(e);
    }
});
exports.DishesController = {
    createNewDishHandler,
    deleteDishHandler,
    updateDishHandler,
    getDishesHandler, getDishHandler
};

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
exports.InventoryController = void 0;
const inventory_service_1 = require("../services/inventory.service");
const http_status_codes_1 = require("http-status-codes");
const updateInventoryItemHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = req.body;
    const { ingredientName } = req.params;
    try {
        yield inventory_service_1.InventoryService.updateInventoryItem(ingredientName, updates);
        return res.status(http_status_codes_1.StatusCodes.OK).send({
            code: http_status_codes_1.StatusCodes.OK,
            message: "inventory item properties updated successfully",
        });
    }
    catch (e) {
        next(e);
    }
});
const getInventoryItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield inventory_service_1.InventoryService.getInventoryItems();
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send(items);
    }
    catch (e) {
        next(e);
    }
});
exports.InventoryController = {
    updateInventoryItemHandler,
    getInventoryItems,
};

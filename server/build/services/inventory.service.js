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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const models_1 = require("../models");
const error_model_1 = require("../models/error.model");
const inventory_item_model_1 = require("../models/inventory_item.model");
const websocket_service_1 = __importDefault(require("./websocket.service"));
const updateInventoryItem = (ingredientName, { available, needed }) => __awaiter(void 0, void 0, void 0, function* () {
    const inventoryItemsRepo = models_1.AppDataSource.getRepository(inventory_item_model_1.InventoryItem);
    const inventoryItemRecord = yield inventoryItemsRepo.findOne({
        where: { ingredient: { name: ingredientName } },
        relations: { ingredient: true },
    });
    if (!inventoryItemRecord) {
        throw new error_model_1.NotFoundError("inventory item(ingredient) not found");
    }
    if (available)
        inventoryItemRecord.available = available;
    if (needed)
        inventoryItemRecord.needed = needed;
    const updateInventoryItemEventPayload = (function () {
        if (available && needed) {
            return { available, needed };
        }
        if (available)
            return { available };
        if (needed)
            return { needed };
    })();
    yield inventoryItemsRepo.save(inventoryItemRecord);
    websocket_service_1.default.publishEvent(["manager", "chef", "cashier"], "update_inventory_item", inventoryItemRecord.ingredient.name, updateInventoryItemEventPayload);
    websocket_service_1.default.publishEvent(["manager", "cashier", "chef"], "notification", `Inventory Item Update | Item : ${inventoryItemRecord.ingredient.name}`, `Available : ${inventoryItemRecord.available} | Needed : ${inventoryItemRecord.needed}`);
});
const getInventoryItems = () => __awaiter(void 0, void 0, void 0, function* () {
    const inventoryItemsRepo = models_1.AppDataSource.getRepository(inventory_item_model_1.InventoryItem);
    const inventoryItems = yield inventoryItemsRepo.find({
        relations: { ingredient: true },
    });
    return inventoryItems.map((inventoryItem) => ({
        name: inventoryItem.ingredient.name,
        available: inventoryItem.available,
        needed: inventoryItem.needed,
        unit: inventoryItem.ingredient.unit,
    }));
});
exports.InventoryService = { updateInventoryItem, getInventoryItems };

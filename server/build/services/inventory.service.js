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
const utils_1 = require("../utils/utils");
const updateInventoryItem = (ingredientName, { available, needed, thresh_hold }) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (thresh_hold)
        inventoryItemRecord.thresh_hold = thresh_hold;
    const updateInventoryItemEventPayload = (0, utils_1.removeUndefinedProperties)({ available, needed, thresh_hold });
    console.log("payload", updateInventoryItemEventPayload);
    yield inventoryItemsRepo.save(inventoryItemRecord);
    websocket_service_1.default.publishEvent(["manager", "chef", "cashier"], "update_inventory_item", inventoryItemRecord.ingredient.name, updateInventoryItemEventPayload);
    websocket_service_1.default.publishEvent(["manager", "cashier", "chef"], "notification", `Inventory Item Update | Item : ${inventoryItemRecord.ingredient.name}`, `Available : ${inventoryItemRecord.available} | Needed : ${inventoryItemRecord.needed}`);
    if (inventoryItemRecord.thresh_hold <= inventoryItemRecord.available) {
        websocket_service_1.default.publishEvent(["manager", "cashier", "chef"], "notification", `Warning`, `Inventory Item : ${inventoryItemRecord.ingredient.name} | About to run out`);
    }
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
        thresh_hold: inventoryItem.thresh_hold
    }));
});
exports.InventoryService = { updateInventoryItem, getInventoryItems };

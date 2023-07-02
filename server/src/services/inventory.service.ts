import {AppDataSource} from "../models";
import {NotFoundError} from "../models/error.model";
import {InventoryItem} from "../models/inventory_item.model";
import {UserRoleType} from "../ts/types/user.types";
import WebsocketService from "./websocket.service";
import {removeUndefinedProperties} from "../utils/utils";

const updateInventoryItem = async (
    ingredientName: string,
    {available, needed, thresh_hold}: Partial<Pick<InventoryItem, "available" | "needed" | "thresh_hold">>
) => {
    const inventoryItemsRepo = AppDataSource.getRepository(InventoryItem);
    const inventoryItemRecord = await inventoryItemsRepo.findOne({
        where: {ingredient: {name: ingredientName}},
        relations: {ingredient: true},
    });
    if (!inventoryItemRecord) {
        throw new NotFoundError("inventory item(ingredient) not found");
    }
    if (available) inventoryItemRecord.available = available;
    if (needed) inventoryItemRecord.needed = needed;
    if (thresh_hold) inventoryItemRecord.thresh_hold = thresh_hold;

    const updateInventoryItemEventPayload = removeUndefinedProperties({available, needed,  thresh_hold});
    await inventoryItemsRepo.save(inventoryItemRecord);
    WebsocketService.publishEvent(
        ["manager", "chef", "cashier"],
        "update_inventory_item",
        inventoryItemRecord.ingredient.name,
        updateInventoryItemEventPayload
    );
    WebsocketService.publishEvent(
        ["manager", "cashier", "chef"],
        "notification",
        `Inventory Item Update | Item : ${inventoryItemRecord.ingredient.name}`,
        `Available : ${inventoryItemRecord.available} | Needed : ${inventoryItemRecord.needed}`
    );
    if (inventoryItemRecord.thresh_hold <= inventoryItemRecord.available) {
        WebsocketService.publishEvent(
            ["manager", "cashier", "chef"],
            "notification",
            `Warning`,
            `Inventory Item : ${inventoryItemRecord.ingredient.name} | About to run out`
        );
    }

};

const getInventoryItems = async () => {
    const inventoryItemsRepo = AppDataSource.getRepository(InventoryItem);
    const inventoryItems = await inventoryItemsRepo.find({
        relations: {ingredient: true},
    });

    return inventoryItems.map((inventoryItem) => ({
        name: inventoryItem.ingredient.name,
        available: inventoryItem.available,
        needed: inventoryItem.needed,
        unit: inventoryItem.ingredient.unit,
        thresh_hold: inventoryItem.thresh_hold
    }))
};

export const InventoryService = {updateInventoryItem, getInventoryItems};

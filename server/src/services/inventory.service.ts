import { AppDataSource } from "../models";
import { NotFoundError } from "../models/error.model";
import { InventoryItem } from "../models/inventory_item.model";
import { UserRoleType } from "../ts/types/user.types";
import WebsocketService from "./websocket.service";

const updateInventoryItem = async (
	ingredientName: string,
	{ available, needed }: Partial<Pick<InventoryItem, "available" | "needed">>
) => {
	const inventoryItemsRepo = AppDataSource.getRepository(InventoryItem);
	const inventoryItemRecord = await inventoryItemsRepo.findOne({
		where: { ingredient: { name: ingredientName } },
		relations: { ingredient: true },
	});
	if (!inventoryItemRecord) {
		throw new NotFoundError("inventory item(ingredient) not found");
	}
	if (available) inventoryItemRecord.available = available;
	if (needed) inventoryItemRecord.needed = needed;
	WebsocketService.getIo()
		.to(["cashier", "chef", "manager"] as UserRoleType[])
		.emit("inventory_item_update", ingredientName, {
			available,
			needed,
		});
	await inventoryItemsRepo.save(inventoryItemRecord);
};

const getInventoryItems = async () => {
	const inventoryItemsRepo = AppDataSource.getRepository(InventoryItem);
	const inventoryItems = await inventoryItemsRepo.find({
		relations: { ingredient: true },
	});

	return inventoryItems.map((inventoryItem) => ({
		name: inventoryItem.ingredient.name,
		available: inventoryItem.available,
		needed: inventoryItem.needed,
		unit: inventoryItem.ingredient.unit,
	}));
};

export const InventoryService = { updateInventoryItem, getInventoryItems };

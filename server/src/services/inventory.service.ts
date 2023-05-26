import { AppDataSource } from "../models";
import { NotFoundError } from "../models/error.model";
import { InventoryItem } from "../models/inventory_item.model";

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
	await inventoryItemsRepo.save(inventoryItemRecord);
};

const getInventoryItems = async () => {
	return [0, 0];
};

export const InventoryService = { updateInventoryItem, getInventoryItems };

import { AppDataSource } from "../models";
import { NotFoundError } from "../models/error.model";
import { Ingredient } from "../models/ingredient.model";
import { InventoryItem } from "../models/inventory_item.model";
import { IRedisInventoryItem } from "../ts/interfaces/inventory.interfaces";
import RedisService from "./redis.service";

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
	const currentAvailable = inventoryItemRecord.available;
	const currentNeeded = inventoryItemRecord.needed;
	await RedisService.redis.hset(
		"inventory:items",
		ingredientName,
		JSON.stringify({
			available: available ? available : currentAvailable,
			needed: needed ? needed : currentNeeded,
			unit: inventoryItemRecord.ingredient.unit,
		})
	);
};

const getInventoryItems = async () => {
	const _items: { [key: string]: string } = await RedisService.redis.hgetall(
		"inventory:items"
	);
	const count = Object.keys(_items).length;
	const items: { name: string; amount: IRedisInventoryItem }[] = Object.entries(
		_items
	).map(([ingredientName, objAsJsonString]) => ({
		name: ingredientName,
		amount: JSON.parse(objAsJsonString),
	}));

	return [items, count];
};

export const InventoryService = { updateInventoryItem, getInventoryItems };

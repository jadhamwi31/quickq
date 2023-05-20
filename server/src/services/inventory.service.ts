import { AppDataSource } from "../models";
import { NotFoundError } from "../models/error.model";
import { Ingredient } from "../models/ingredient.model";
import { InventoryItem } from "../models/inventory_item.model";

const updateInventoryItem = async (
	ingredientName: string,
	{ available, needed }: Partial<Pick<InventoryItem, "available" | "needed">>
) => {
	console.log(ingredientName);

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
	const [items, count] = await AppDataSource.createQueryBuilder()
		.from(InventoryItem, "inventory_item")
		.addSelect(["inventory_item.available", "inventory_item.needed"])
		.leftJoin("inventory_item.ingredient", "ingredient")
		.addSelect(["ingredient.name", "ingredient.unit"])
		.getManyAndCount();
	return [items, count];
};

export const InventoryService = { updateInventoryItem, getInventoryItems };

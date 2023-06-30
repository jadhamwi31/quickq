import { NextFunction, Request, Response } from "express";
import { InventoryItem } from "../models/inventory_item.model";
import { InventoryService } from "../services/inventory.service";
import { StatusCodes } from "http-status-codes";

const updateInventoryItemHandler = async (
	req: Request<
		{ ingredientName: string },
		{},
		Partial<Pick<InventoryItem, "available" | "needed">>
	>,
	res: Response,
	next: NextFunction
) => {
	const updates = req.body;
	const { ingredientName } = req.params;
	try {
		await InventoryService.updateInventoryItem(ingredientName, updates);
		return res.status(StatusCodes.OK).send({
			code: StatusCodes.OK,
			message: "inventory item properties updated successfully",
		});
	} catch (e) {
		next(e);
	}
};

const getInventoryItems = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const items = await InventoryService.getInventoryItems();
		return res
			.status(StatusCodes.OK)
			.send(items);
	} catch (e) {
		next(e);
	}
};

export const InventoryController = {
	updateInventoryItemHandler,
	getInventoryItems,
};

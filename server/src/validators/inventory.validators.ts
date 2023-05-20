import { NextFunction, Request, Response } from "express";
import { InventoryItem } from "../models/inventory_item.model";
import { BadRequestError } from "../models/error.model";

const updateInventoryItemValidator = (
	req: Request<
		Partial<{ ingredientName: string }>,
		{},
		Partial<Pick<InventoryItem, "available" | "needed">>
	>,
	res: Response,
	next: NextFunction
) => {
	const { available, needed } = req.body;
	const { ingredientName } = req.params;
	if (!available && !needed) {
		next(
			new BadRequestError("provide available or needed amount to be updated")
		);
	}
	if (!ingredientName) {
		next(new BadRequestError("ingredient name is required"));
	}
	return next();
};

export const InventoryValidator = { updateInventoryItemValidator };

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
	if (!available) {
		next(new BadRequestError("available is needed"));
	}
	if (!needed) {
		next(new BadRequestError("needed is needed"));
	}
	if (!ingredientName) {
		next(new BadRequestError("ingredient name is required"));
	}
	return next();
};

export const InventoryValidator = { updateInventoryItemValidator };

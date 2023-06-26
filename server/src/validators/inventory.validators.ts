import { NextFunction, Request, Response } from "express";
import { InventoryItem } from "../models/inventory_item.model";
import { BadRequestError } from "../models/error.model";

const updateInventoryItemValidator = (
	req: Request<
		Partial<{ ingredientName: string }>,
		{},
		Partial<Pick<InventoryItem, "available" | "needed" | "thresh_hold">>
	>,
	res: Response,
	next: NextFunction
) => {
	const { available, needed ,thresh_hold} = req.body;
	const { ingredientName } = req.params;
	if (!available && !needed && !thresh_hold) {
		next(new BadRequestError("available or needed is required"));
	}
	if (!ingredientName) {
		next(new BadRequestError("ingredient name is required"));
	}
	return next();
};

export const InventoryValidator = { updateInventoryItemValidator };

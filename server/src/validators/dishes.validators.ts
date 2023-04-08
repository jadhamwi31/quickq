import { NextFunction, Request, Response } from "express";
import { IDish } from "../ts/interfaces/dish.interfaces";
import { MissingPropertiesError } from "../models/error.model";

const validateCreateNewDish = (
	req: Request<any, any, Partial<IDish>>,
	res: Response,
	next: NextFunction
) => {
	const { name, description, price, ingredients } = req.body;
	if (!name) {
		return next(new MissingPropertiesError("name is required"));
	}
	if (!description) {
		return next(new MissingPropertiesError("description is required"));
	}
	if (!price) {
		return next(new MissingPropertiesError("price is required"));
	}
	if (!ingredients || ingredients.length === 0) {
		return next(new MissingPropertiesError("ingredients are required"));
	}
	return next();
};

export const DishesValidator = {
	validateCreateNewDish,
};

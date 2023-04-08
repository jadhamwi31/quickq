import { NextFunction, Request, Response } from "express";
import { Ingredient } from "../models/ingredient.model";
import { MissingPropertiesError } from "../models/error.model";

const validateCreateIngredient = (
	req: Request<any, any, Partial<Pick<Ingredient, "name" | "unit">>>,
	_: Response,
	next: NextFunction
) => {
	const { name, unit } = req.body;
	if (!name) {
		return next(new MissingPropertiesError("name is required"));
	}
	if (!unit) {
		return next(new MissingPropertiesError("unit is required"));
	}
	next();
};

const validateDeleteIngredient = (
	req: Request<Partial<Pick<Ingredient, "name">>>,
	_: Response,
	next: NextFunction
) => {
	const { name } = req.params;
	if (!name) {
		return next(new MissingPropertiesError("name is required"));
	}
	next();
};

export const IngredientsValidators = {
	validateCreateIngredient,
	validateDeleteIngredient,
};

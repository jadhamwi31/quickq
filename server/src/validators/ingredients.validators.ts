import { NextFunction, Request, Response } from "express";
import { Ingredient } from "../models/ingredient.model";
import { BadRequestError } from "../models/error.model";
import { isString } from "lodash";

const validateCreateIngredient = async (
	req: Request<any, any, Partial<Pick<Ingredient, "name" | "unit">>>,
	_: Response,
	next: NextFunction
) => {
	const { name, unit } = req.body;
	if (!name) {
		return next(new BadRequestError("name is required"));
	}
	if (!unit || !isString(unit)) {
		return next(new BadRequestError("unit is required"));
	}
	return next();
};

const validateDeleteIngredient = async (
	req: Request<Partial<Pick<Ingredient, "name">>>,
	_: Response,
	next: NextFunction
) => {
	const { name } = req.params;
	if (!name) {
		return next(new BadRequestError("name is required"));
	}
	return next();
};

const validateUpdateIngredient = async (
	req: Request<
		Partial<Pick<Ingredient, "name">>,
		any,
		Partial<Pick<Ingredient, "name" | "unit">>
	>,
	res: Response,
	next: NextFunction
) => {
	const { name, unit } = req.body;
	const ingredientName = req.params.name;
	if (!name && !unit) {
		return next(new BadRequestError("provide updates (name or unit) in body"));
	}
	if (!ingredientName) {
		return next(new BadRequestError("name parameter is missing"));
	}
	return next();
};

export const IngredientsValidators = {
	validateCreateIngredient,
	validateDeleteIngredient,
	validateUpdateIngredient,
};

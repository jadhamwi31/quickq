import { NextFunction, Request, Response } from "express";
import { IDish } from "../ts/interfaces/dish.interfaces";
import { MissingPropertiesError } from "../models/error.model";
import { Dish } from "../models/dish.model";

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

const validateDeleteDish = (
	req: Request<Partial<Pick<IDish, "name">>>,
	res: Response,
	next: NextFunction
) => {
	const { name } = req.params;
	if (!name) {
		return next(new MissingPropertiesError("name is required"));
	}
	return next();
};

const validateUpdateDish = (
	req: Request<Partial<Pick<Dish, "name">>, any, Partial<IDish>>,
	res: Response,
	next: NextFunction
) => {
	const { name, description, price, ingredients } = req.body;
	const dishName = req.params.name;
	if (!name) {
		return next(new MissingPropertiesError("key : name is required"));
	}
	if (!description) {
		return next(new MissingPropertiesError("key : description is required"));
	}
	if (!price) {
		return next(new MissingPropertiesError("key : price is required"));
	}
	if (!ingredients || ingredients.length === 0) {
		return next(new MissingPropertiesError("key : ingredients is required"));
	}
	if (!dishName) {
		return next(new MissingPropertiesError("dish name parameter is missing"));
	}
	return next();
};

export const DishesValidator = {
	validateCreateNewDish,
	validateDeleteDish,
	validateUpdateDish,
};

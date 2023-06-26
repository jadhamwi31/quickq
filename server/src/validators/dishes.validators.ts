import { NextFunction, Request, Response } from "express";
import { IDish } from "../ts/interfaces/dish.interfaces";
import { BadRequestError } from "../models/error.model";
import { Dish } from "../models/dish.model";

const validateCreateNewDish = (
	req: Request<any, any, Partial<IDish>>,
	res: Response,
	next: NextFunction
) => {
	const { name, description, price, ingredients, category } = req.body;
	if (!name) {
		return next(new BadRequestError("name is required"));
	}
	if (!category) {
		return next(new BadRequestError("category is required"));
	}
	if (!description) {
		return next(new BadRequestError("description is required"));
	}
	if (!price) {
		return next(new BadRequestError("price is required"));
	}
	if (!ingredients || ingredients.length === 0) {
		return next(new BadRequestError("ingredients are required"));
	}
	if (
		!ingredients.every((ingredient) => ingredient.amount && ingredient.name)
	) {
		return next(new BadRequestError("invalid ingredients"));
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
		return next(new BadRequestError("name is required"));
	}
	return next();
};

const validateUpdateDish = (
	req: Request<Partial<Pick<Dish, "name">>, any, Partial<IDish>>,
	res: Response,
	next: NextFunction
) => {
	const { name, price, description, ingredients, category } = req.body;
	const dishName = req.params.name;
	if (!name && !price && !description && !ingredients && !category) {
		return next(new BadRequestError("update fields are missing"));
	}

	if (ingredients)
		ingredients.forEach((ingredient) => {
			if (!ingredient.name && !ingredient.amount) {
				return next(
					new BadRequestError("ingredient : name or amount is missing")
				);
			}
		});

	if (!dishName) {
		return next(new BadRequestError("dish name parameter is missing"));
	}
	return next();
};

const validateGetDish = (
	req: Request<Partial<Pick<Dish, "id">>>,
	res: Response,
	next: NextFunction
) => {
	if(!req.params.id){
		return next(new BadRequestError("dish id is required"))
	}
	return next();
};


export const DishesValidator = {
	validateCreateNewDish,
	validateDeleteDish,
	validateUpdateDish,validateGetDish
};

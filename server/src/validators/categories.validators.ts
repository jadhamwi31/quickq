import { NextFunction, Request, Response } from "express";
import { Category } from "../models/category.model";
import { BadRequestError } from "../models/error.model";

const validateCreateNewCategory = (
	req: Request<any, any, Partial<Pick<Category, "name" | "image">>>,
	res: Response,
	next: NextFunction
) => {
	const { name } = req.body;
	if (!name) {
		return next(new BadRequestError("name is required"));
	}

	return next();
};

const validateDeleteCategory = (
	req: Request<Partial<Pick<Category, "name">>>,
	res: Response,
	next: NextFunction
) => {
	const { name } = req.params;
	if (!name) {
		return next(new BadRequestError("name parameter is required"));
	}
	return next();
};

const validateUpdateCategory = (
	req: Request<
		Partial<Pick<Category, "name">>,
		any,
		Partial<Pick<Category, "name" | "image">>
	>,
	res: Response,
	next: NextFunction
) => {
	const categoryName = req.params.name;
	const { name, image } = req.body;
	if (!name) {
		return next(new BadRequestError("key : [name] is required"));
	}
	if (!categoryName && !image) {
		return next(new BadRequestError("new category name or image is required"));
	}
	return next();
};

export const CategoriesValidators = {
	validateCreateNewCategory,
	validateDeleteCategory,
	validateUpdateCategory,
};

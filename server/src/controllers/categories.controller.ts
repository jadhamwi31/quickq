import { NextFunction, Request, Response } from "express";
import { Category } from "../models/category.model";
import { CategoriesService } from "../services/categories.service";
import { StatusCodes } from "http-status-codes";

const createNewCategoryHandler = async (
	req: Request<any, any, Pick<Category, "name"> & { image: string }>,
	res: Response,
	next: NextFunction
) => {
	const { name, image } = req.body;
	try {
		await CategoriesService.createNewCategory(name, image);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "category created" });
	} catch (e) {
		next(e);
	}
};

const deleteCategoryHandler = async (
	req: Request<Pick<Category, "name">>,
	res: Response,
	next: NextFunction
) => {
	const { name } = req.params;
	try {
		await CategoriesService.deleteCategory(name);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "category deleted" });
	} catch (e) {
		next(e);
	}
};

const updateCategoryHandler = async (
	req: Request<
		Partial<Pick<Category, "name">>,
		any,
		Partial<Pick<Category, "name" | "image">>
	>,
	res: Response,
	next: NextFunction
) => {
	const { name, image } = req.body;
	const categoryName = req.params.name;
	try {
		await CategoriesService.updateCategory(categoryName, name, image);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "category updated" });
	} catch (e) {
		next(e);
	}
};

const getCategoriesHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const categories = await CategoriesService.getCategories();
		return res.status(StatusCodes.OK).send(categories);
	} catch (e) {
		next(e);
	}
};

export const CategoriesController = {
	createNewCategoryHandler,
	deleteCategoryHandler,
	updateCategoryHandler,
	getCategoriesHandler,
};

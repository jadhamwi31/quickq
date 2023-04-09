import { NextFunction, Request, Response } from "express";
import { Ingredient } from "../models/ingredient.model";
import { IngredientsService } from "../services/ingredients.service";
import { StatusCodes } from "http-status-codes";

const createNewIngredientHandler = async (
	req: Request<any, any, Pick<Ingredient, "name" | "unit">>,
	res: Response,
	next: NextFunction
) => {
	const { name, unit } = req.body;
	try {
		await IngredientsService.createNewIngredient({ name, unit });
		return res
			.status(StatusCodes.OK)
			.send({ message: "ingredient created", code: StatusCodes.OK });
	} catch (e) {
		next(e);
	}
};

const updateIngredientHandler = async (
	req: Request<
		Pick<Ingredient, "name">,
		any,
		Pick<Ingredient, "name" | "unit">
	>,
	res: Response,
	next: NextFunction
) => {
	const { name, unit } = req.body;
	const ingredientName = req.params.name;
	try {
		await IngredientsService.updateIngredient(ingredientName, { name, unit });
		return res
			.status(StatusCodes.OK)
			.send({ message: "ingredient updated", code: StatusCodes.OK });
	} catch (e) {
		next(e);
	}
};

const deleteIngredientHandler = async (
	req: Request<Pick<Ingredient, "name">>,
	res: Response,
	next: NextFunction
) => {
	const { name } = req.params;
	try {
		await IngredientsService.deleteIngredient(name);
		return res
			.status(StatusCodes.OK)
			.send({ message: "ingredient resource deleted", code: StatusCodes.OK });
	} catch (e) {
		next(e);
	}
};

const getIngredientsHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const ingredients = await IngredientsService.getIngredients();
		return res.status(StatusCodes.OK).send(ingredients);
	} catch (e) {
		next(e);
	}
};

export const IngredientsController = {
	createNewIngredientHandler,
	deleteIngredientHandler,
	getIngredientsHandler,
	updateIngredientHandler,
};

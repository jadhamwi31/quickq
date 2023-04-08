import { NextFunction, Request, Response } from "express";
import { IDish } from "../ts/interfaces/dish.interfaces";
import { DishesService } from "../services/dishes.service";
import { StatusCodes } from "http-status-codes";

const createNewDishHandler = async (
	req: Request<any, any, IDish>,
	res: Response,
	next: NextFunction
) => {
	const dish = req.body;
	try {
		await DishesService.createNewDish(dish);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "dish created" });
	} catch (e) {
		next(e);
	}
};

export const DishesController = {
	createNewDishHandler,
};

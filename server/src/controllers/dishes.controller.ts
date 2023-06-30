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

const deleteDishHandler = async (
	req: Request<Pick<IDish, "name">>,
	res: Response,
	next: NextFunction
) => {
	const { name } = req.params;
	try {
		await DishesService.deleteDish(name);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "dish deleted" });
	} catch (e) {
		next(e);
	}
};

const getDishesHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const dishes = await DishesService.getDishes();
		return res.status(StatusCodes.OK).send(dishes);
	} catch (e) {
		next(e);
	}
};

const getDishHandler = async (
	req: Request<{id:number}>,
	res: Response,
	next: NextFunction
) => {
	try {
		const dish = await DishesService.getDishById(req.params.id);
		return res.status(StatusCodes.OK).send(dish);
	} catch (e) {
		return next(e);
	}
};

const updateDishHandler = async (
	req: Request<Pick<IDish, "name">, any, Partial<IDish>>,
	res: Response,
	next: NextFunction
) => {
	const dish = req.body;
	const dishName = req.params.name;
	try {
		await DishesService.updateDish(dishName, dish);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "dish updated" });
	} catch (e) {
		next(e);
	}
};

export const DishesController = {
	createNewDishHandler,
	deleteDishHandler,
	updateDishHandler,
	getDishesHandler,getDishHandler
};

import { NextFunction, Request, Response } from "express";
import { IMenu } from "../ts/interfaces/menu.interfaces";
import { MenuService } from "../services/menu.service";
import { StatusCodes } from "http-status-codes";

const createMenuHandler = async (
	req: Request<{}, {}, IMenu>,
	res: Response,
	next: NextFunction
) => {
	try {
		await MenuService.createMenu(req.body);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "menu created" });
	} catch (e) {
		next(e);
	}
};

const getMenuHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { menu, categories } = await MenuService.getMenu();
		return res.status(StatusCodes.OK).send({
			code: StatusCodes.OK,
			data: {
				menu,
				categories,
			},
		});
	} catch (e) {
		next(e);
	}
};

export const MenuController = { createMenuHandler, getMenuHandler };

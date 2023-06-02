import { NextFunction, Request, Response } from "express";
import {
	IMenuCustomization,
	IMenuCustomizationReformed,
} from "../ts/interfaces/menu.interfaces";
import { MenuService } from "../services/menu.service";
import { StatusCodes } from "http-status-codes";

const addMenuCustomizationHandler = async (
	req: Request<{}, {}, IMenuCustomization>,
	res: Response,
	next: NextFunction
) => {
	try {
		await MenuService.addMenuCustomization(req.body);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "menu customization created" });
	} catch (e) {
		next(e);
	}
};

const updateMenuCustomizationHandler = async (
	req: Request<{ name: string }, {}, IMenuCustomizationReformed>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name } = req.params;
		await MenuService.updateMenuCustomization(name, req.body);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "menu customization updated" });
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

export const MenuController = {
	addMenuCustomizationHandler,
	getMenuHandler,
	updateMenuCustomizationHandler,
};

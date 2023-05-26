import { NextFunction, Request, Response } from "express";
import { IMenu } from "../ts/interfaces/menu.interfaces";
import z from "zod";
import { BadRequestError } from "../models/error.model";

type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
	  }
	: T;

const MenuHeaderStylesSchema = z.object({
	bgColor: z.string().nonempty(),
	left: z.string().nonempty(),
	right: z.string().nonempty(),
});

const MenuBodyStylesSchema = z.object({
	color: z.string().nonempty(),
	bgColor: z.string().nonempty(),
});

const MenuCategoriesOrderTypeSchema = z.array(z.string().nonempty());

const menuSchema = z.object({
	header: z.object({ styles: MenuHeaderStylesSchema }),
	body: z.object({
		categoriesOrder: MenuCategoriesOrderTypeSchema,
		styles: MenuBodyStylesSchema,
	}),
});

const validateMenu = (
	req: Request<{}, {}, DeepPartial<IMenu>>,
	res: Response,
	next: NextFunction
) => {
	const menu = req.body;

	try {
		menuSchema.parse(menu);
		return next();
	} catch (e) {
		console.log(e);

		return next(new BadRequestError("some menu properties are missing"));
	}
};

export const MenuValidators = {
	validateMenu,
};

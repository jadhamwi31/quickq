import { NextFunction, Request, Response } from "express";
import { IMenuCustomization } from "../ts/interfaces/menu.interfaces";
import z from "zod";
import { BadRequestError } from "../models/error.model";

type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
	  }
	: T;

const createMenuCustomizationSchema = (type: "optional" | "required") => {
	if (type === "optional") {
		const CSSPropertiesSchema = z.record(z.any(), z.any()).optional();

		const MenuCategoriesOrderSchema = z.array(z.string()).optional();

		return z.object({
			name: z.string().optional(),
			body: CSSPropertiesSchema,
			item: CSSPropertiesSchema,
			category: CSSPropertiesSchema,
			categories_order: MenuCategoriesOrderSchema,
			status: z.union([z.literal("active"), z.literal("in-active")]).optional(),
		});
	} else {
		const CSSPropertiesSchema = z.record(z.any(), z.any());

		const MenuCategoriesOrderSchema = z.array(z.string());

		return z.object({
			name: z.string(),
			body: CSSPropertiesSchema,
			item: CSSPropertiesSchema,
			category: CSSPropertiesSchema,
			categories_order: MenuCategoriesOrderSchema,
		});
	}
};

const validateAddMenuCustomization = (
	req: Request<{}, {}, DeepPartial<IMenuCustomization>>,
	res: Response,
	next: NextFunction
) => {
	const menu = req.body;

	try {
		createMenuCustomizationSchema("required").parse(menu);
		return next();
	} catch (e) {
		console.log(e);

		return next(new BadRequestError("re-check menu properties"));
	}
};

const validateUpdateMenuCustomization = (
	req: Request<Partial<{ name: string }>, {}, DeepPartial<IMenuCustomization>>,
	res: Response,
	next: NextFunction
) => {
	const menu = req.body;

	try {
		const { name } = req.params;
		createMenuCustomizationSchema("optional").parse(menu);
		if (!name) {
			return next(new BadRequestError("style name is required"));
		}
		return next();
	} catch (e) {
		console.log(e);

		return next(new BadRequestError("re-check menu properties"));
	}
};

export const MenuValidators = {
	validateAddMenuCustomization,
	validateUpdateMenuCustomization,
};

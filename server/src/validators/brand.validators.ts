import { NextFunction, Request, Response } from "express";
import { Brand } from "../models/brand.model";
import { BadRequestError } from "../models/error.model";

const validateCreateBrand = (
	req: Request<{}, {}, Partial<Brand>>,
	res: Response,
	next: NextFunction
) => {
	const { name } = req.body;
	if (!name) {
		next(new BadRequestError("name is missing"));
	}

	return next();
};

const validateBrandUpdate = (
	req: Request<{}, {}, Partial<Brand>>,
	res: Response,
	next: NextFunction
) => {
	const { name, slogan, logo } = req.body;
	if (!name && !slogan && !logo) {
		return next(new BadRequestError("brand update parameters missing"));
	}
	return next();
};

export const BrandValidators = { validateCreateBrand, validateBrandUpdate };

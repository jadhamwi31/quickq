import { NextFunction, Request, Response } from "express";
import { Brand } from "../models/brand.model";
import { BadRequestError } from "../models/error.model";

const validateSetBrand = (
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

export const BrandValidators = {
	validateSetBrand,
};

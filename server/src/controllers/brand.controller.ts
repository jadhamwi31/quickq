import { NextFunction, Request, Response } from "express";
import { Brand } from "../models/brand.model";
import { BrandService } from "../services/brand.service";
import { StatusCodes } from "http-status-codes";

const setBrandHandler = async (
	req: Request<{}, {}, Partial<Brand>>,
	res: Response,
	next: NextFunction
) => {
	const brand = req.body;
	try {
		await BrandService.setBrand(brand);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "brand updated" });
	} catch (e) {
		next(e);
	}
};

const getBrandHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const brand = await BrandService.getBrand();
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, data: { brand } });
	} catch (e) {
		next(e);
	}
};

export const BrandController = {
	setBrandHandler,
	getBrandHandler,
};

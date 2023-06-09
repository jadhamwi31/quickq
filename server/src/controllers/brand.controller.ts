import { NextFunction, Request, Response } from "express";
import { Brand } from "../models/brand.model";
import { BrandService } from "../services/brand.service";
import { StatusCodes } from "http-status-codes";

const createNewBrandHandler = async (
	req: Request<{}, {}, Brand>,
	res: Response,
	next: NextFunction
) => {
	const brand = req.body;
	try {
		await BrandService.createNewBrand(brand);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "brand created" });
	} catch (e) {
		next(e);
	}
};

const updateBrandHandler = async (
	req: Request<{}, {}, Partial<Brand>>,
	res: Response,
	next: NextFunction
) => {
	const brand = req.body;
	try {
		await BrandService.updateBrand(brand);
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "brand updated" });
	} catch (e) {
		next(e);
	}
};

const deleteBrandHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await BrandService.deleteBrand();
		return res
			.status(StatusCodes.OK)
			.send({ code: StatusCodes.OK, message: "brand deleted" });
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
	createNewBrandHandler,
	updateBrandHandler,
	deleteBrandHandler,
	getBrandHandler,
};

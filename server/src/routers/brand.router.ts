import { Router } from "express";
import { BrandController } from "../controllers/brand.controller";
import { uploadMiddlewares } from "../middlewares/upload.middleware";
import { BrandValidators } from "../validators/brand.validators";

export const BrandRouter = Router();

BrandRouter.put(
	"/",
	...uploadMiddlewares("logo"),
	BrandValidators.validateSetBrand,
	BrandController.setBrandHandler
);

BrandRouter.get("/", BrandController.getBrandHandler);

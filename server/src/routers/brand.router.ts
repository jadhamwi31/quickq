import { Router } from "express";
import { BrandValidators } from "../validators/brand.validators";
import { BrandController } from "../controllers/brand.controller";

export const BrandRouter = Router();

BrandRouter.post(
	"/",
	BrandValidators.validateCreateBrand,
	BrandController.createNewBrandHandler
);

BrandRouter.put(
	"/",
	BrandValidators.validateBrandUpdate,
	BrandController.updateBrandHandler
);

BrandRouter.delete("/", BrandController.deleteBrandHandler);

BrandRouter.get("/", BrandController.getBrandHandler);

import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";
import { authFor } from "../middlewares/auth.middleware";
import { uploadMiddlewares } from "../middlewares/upload.middleware";
import { CategoriesValidators } from "../validators/categories.validators";
export const CategoriesRouter = Router();

CategoriesRouter.post(
	"/",
	authFor(["manager"]),
	...uploadMiddlewares("image"),
	CategoriesValidators.validateCreateNewCategory,
	CategoriesController.createNewCategoryHandler
);

CategoriesRouter.delete(
	"/:name",
	authFor(["manager"]),
	...uploadMiddlewares("image"),
	CategoriesValidators.validateDeleteCategory,
	CategoriesController.deleteCategoryHandler
);

CategoriesRouter.put(
	"/:name",
	...uploadMiddlewares("image"),
	authFor(["manager"]),
	CategoriesValidators.validateUpdateCategory,
	CategoriesController.updateCategoryHandler
);

CategoriesRouter.get(
	"/",
	authFor(["manager"]),
	CategoriesController.getCategoriesHandler
);

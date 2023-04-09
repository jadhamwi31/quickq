import { Router } from "express";
import { CategoriesValidators } from "../validators/categories.validators";
import { authFor } from "../middlewares/auth.middleware";
import { CategoriesController } from "../controllers/categories.controller";

export const CategoriesRouter = Router();

CategoriesRouter.post(
	"/",
	authFor(["manager"]),
	CategoriesValidators.validateCreateNewCategory,
	CategoriesController.createNewCategoryHandler
);

CategoriesRouter.delete(
	"/:name",
	authFor(["manager"]),
	CategoriesValidators.validateDeleteCategory,
	CategoriesController.deleteCategoryHandler
);

CategoriesRouter.put(
	"/:name",
	authFor(["manager"]),
	CategoriesValidators.validateUpdateCategory,
	CategoriesController.updateCategoryHandler
);

CategoriesRouter.get(
	"/",
	authFor(["manager"]),
	CategoriesController.getCategoriesHandler
);

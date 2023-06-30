import { Router } from "express";
import { DishesValidator } from "../validators/dishes.validators";
import { authFor } from "../middlewares/auth.middleware";
import { DishesController } from "../controllers/dishes.controller";
import { uploadMiddlewares } from "../middlewares/upload.middleware";

export const DishesRouter = Router();

DishesRouter.post(
	"/",
	authFor(["manager"]),
	...uploadMiddlewares("image"),
	DishesValidator.validateCreateNewDish,
	DishesController.createNewDishHandler
);

DishesRouter.delete(
	"/:name",
	authFor(["manager"]),
	DishesValidator.validateDeleteDish,
	DishesController.deleteDishHandler
);

DishesRouter.put(
	"/:name",
	authFor(["manager"]),
	...uploadMiddlewares("image"),
	DishesValidator.validateUpdateDish,
	DishesController.updateDishHandler
);

DishesRouter.get(
	"/",
	DishesController.getDishesHandler
);

DishesRouter.get("/:id",DishesValidator.validateGetDish,DishesController.getDishHandler)

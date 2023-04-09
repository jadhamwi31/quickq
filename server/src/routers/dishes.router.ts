import { Router } from "express";
import { DishesValidator } from "../validators/dishes.validators";
import { authFor } from "../middlewares/auth.middleware";
import { DishesController } from "../controllers/dishes.controller";

export const DishesRouter = Router();

DishesRouter.post(
	"/",
	authFor(["manager"]),
	DishesValidator.validateCreateNewDish,
	DishesController.createNewDishHandler
);

DishesRouter.delete(
	"/",
	authFor(["manager"]),
	DishesValidator.validateDeleteDish,
	DishesController.deleteDishHandler
);

DishesRouter.put(
	"/:name",
	authFor(["manager"]),
	DishesValidator.validateUpdateDish,
	DishesController.updateDishHandler
);

DishesRouter.get("/", authFor(["manager"]), DishesController.getDishesHandler);

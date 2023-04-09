import { Router } from "express";
import { IngredientsValidators } from "../validators/ingredients.validators";
import { IngredientsController } from "../controllers/ingredients.controller";
import { authFor } from "../middlewares/auth.middleware";

export const IngredientsRouter = Router();

IngredientsRouter.post(
	"/",
	authFor(["manager", "chef"]),
	IngredientsValidators.validateCreateIngredient,
	IngredientsController.createNewIngredientHandler
);

IngredientsRouter.delete(
	"/:name",
	authFor(["manager", "chef"]),
	IngredientsValidators.validateDeleteIngredient,
	IngredientsController.deleteIngredientHandler
);

IngredientsRouter.put(
	"/:name",
	authFor(["manager", "chef"]),
	IngredientsValidators.validateUpdateIngredient,
	IngredientsController.updateIngredientHandler
);

IngredientsRouter.get(
	"/",
	authFor(["manager", "chef"]),
	IngredientsController.getIngredientsHandler
);

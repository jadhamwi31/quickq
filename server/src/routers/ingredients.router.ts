import { Router } from "express";
import { IngredientsValidators } from "../validators/ingredients.validators";
import { IngredientsController } from "../controllers/ingredients.controller";

export const IngredientsRouter = Router();

IngredientsRouter.post(
	"/",
	IngredientsValidators.validateCreateIngredient,
	IngredientsController.createNewIngredientHandler
);

IngredientsRouter.delete(
	"/:name",
	IngredientsValidators.validateDeleteIngredient,
	IngredientsController.deleteIngredientHandler
);

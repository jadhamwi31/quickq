"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientsRouter = void 0;
const express_1 = require("express");
const ingredients_validators_1 = require("../validators/ingredients.validators");
const ingredients_controller_1 = require("../controllers/ingredients.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
exports.IngredientsRouter = (0, express_1.Router)();
exports.IngredientsRouter.post("/", (0, auth_middleware_1.authFor)(["manager", "chef"]), ingredients_validators_1.IngredientsValidators.validateCreateIngredient, ingredients_controller_1.IngredientsController.createNewIngredientHandler);
exports.IngredientsRouter.delete("/:name", (0, auth_middleware_1.authFor)(["manager", "chef"]), ingredients_validators_1.IngredientsValidators.validateDeleteIngredient, ingredients_controller_1.IngredientsController.deleteIngredientHandler);
exports.IngredientsRouter.put("/:name", (0, auth_middleware_1.authFor)(["manager", "chef"]), ingredients_validators_1.IngredientsValidators.validateUpdateIngredient, ingredients_controller_1.IngredientsController.updateIngredientHandler);
exports.IngredientsRouter.get("/", (0, auth_middleware_1.authFor)(["manager", "chef"]), ingredients_controller_1.IngredientsController.getIngredientsHandler);

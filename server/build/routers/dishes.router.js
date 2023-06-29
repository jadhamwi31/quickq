"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishesRouter = void 0;
const express_1 = require("express");
const dishes_validators_1 = require("../validators/dishes.validators");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const dishes_controller_1 = require("../controllers/dishes.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
exports.DishesRouter = (0, express_1.Router)();
exports.DishesRouter.post("/", (0, auth_middleware_1.authFor)(["manager"]), ...(0, upload_middleware_1.uploadMiddlewares)("image"), dishes_validators_1.DishesValidator.validateCreateNewDish, dishes_controller_1.DishesController.createNewDishHandler);
exports.DishesRouter.delete("/:name", (0, auth_middleware_1.authFor)(["manager"]), dishes_validators_1.DishesValidator.validateDeleteDish, dishes_controller_1.DishesController.deleteDishHandler);
exports.DishesRouter.put("/:name", (0, auth_middleware_1.authFor)(["manager"]), ...(0, upload_middleware_1.uploadMiddlewares)("image"), dishes_validators_1.DishesValidator.validateUpdateDish, dishes_controller_1.DishesController.updateDishHandler);
exports.DishesRouter.get("/", dishes_controller_1.DishesController.getDishesHandler);
exports.DishesRouter.get("/:id", dishes_validators_1.DishesValidator.validateGetDish, dishes_controller_1.DishesController.getDishHandler);

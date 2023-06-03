import { Router } from "express";
import { authFor } from "../middlewares/auth.middleware";
import { MenuValidators } from "../validators/menu.validators";
import { MenuController } from "../controllers/menu.controller";

export const MenuRouter = Router();

MenuRouter.post(
	"/",
	authFor(["manager"]),
	MenuValidators.validateAddMenuCustomization,
	MenuController.addMenuCustomizationHandler
);

MenuRouter.put(
	"/:name",
	authFor(["manager"]),
	MenuValidators.validateUpdateMenuCustomization,
	MenuController.updateMenuCustomizationHandler
);

MenuRouter.delete(
	"/:name",
	authFor(["manager"]),
	MenuValidators.validateDeleteMenuCustomization,
	MenuController.deleteMenuCustomizationHandler
);

MenuRouter.get("/", authFor(["manager"]), MenuController.getMenuHandler);

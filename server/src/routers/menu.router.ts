import { Router } from "express";
import { authFor } from "../middlewares/auth.middleware";
import { MenuValidators } from "../validators/menu.validators";
import { MenuController } from "../controllers/menu.controller";

export const MenuRouter = Router();

MenuRouter.post(
	"/customizations",
	authFor(["manager"]),
	MenuValidators.validateAddMenuCustomization,
	MenuController.addMenuCustomizationHandler
);

MenuRouter.put(
	"/customizations/:name",
	authFor(["manager"]),
	MenuValidators.validateUpdateMenuCustomization,
	MenuController.updateMenuCustomizationHandler
);

MenuRouter.delete(
	"/customizations/:name",
	authFor(["manager"]),
	MenuValidators.validateDeleteMenuCustomization,
	MenuController.deleteMenuCustomizationHandler
);

MenuRouter.get("/active",  MenuController.getMenuHandler);

MenuRouter.get(
	"/customizations",
	authFor(["manager"]),
	MenuController.getAllMenuCustomizationsHandler
);

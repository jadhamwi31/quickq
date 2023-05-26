import { Router } from "express";
import { authFor } from "../middlewares/auth.middleware";
import { MenuValidators } from "../validators/menu.validators";
import { MenuController } from "../controllers/menu.controller";

export const MenuRouter = Router();

MenuRouter.put(
	"/",
	authFor(["manager"]),
	MenuValidators.validateMenu,
	MenuController.createMenuHandler
);

MenuRouter.get("/", authFor(["manager"]), MenuController.getMenuHandler);

import { Router } from "express";
import { InventoryValidator } from "../validators/inventory.validators";
import { authFor } from "../middlewares/auth.middleware";
import { InventoryController } from "../controllers/inventory.controller";

export const InventoryRouter = Router();

InventoryRouter.put(
	"/items/:ingredientName",
	authFor(["manager", "chef", "cashier"]),
	InventoryValidator.updateInventoryItemValidator,
	InventoryController.updateInventoryItemHandler
);

InventoryRouter.get(
	"/items",
	authFor(["manager", "cashier", "chef"]),
	InventoryController.getInventoryItems
);

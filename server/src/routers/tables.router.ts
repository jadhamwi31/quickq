import { Router } from "express";
import { TablesValidators } from "../validators/tables.validators";
import { TablesController } from "../controllers/tables.controller";
import { authFor } from "../middlewares/auth.middleware";

export const TablesRouter = Router();

TablesRouter.post(
	"/",
	authFor(["manager"]),
	TablesValidators.validateNewTable,
	TablesController.newTableHandler
);

TablesRouter.put(
	"/:id",
	authFor(["manager"]),
	TablesValidators.validateUpdateTable,
	TablesController.updateTableHandler
);

TablesRouter.delete(
	"/:id",
	authFor(["manager"]),
	TablesValidators.validateDeleteTable,
	TablesController.deleteTableHandler
);

TablesRouter.get(
	"/",
	authFor(["cashier", "manager"]),
	TablesController.getTablesHandler
);

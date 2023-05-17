import { Router } from "express";
import { TablesValidators } from "../validators/tables.validators";
import { TablesController } from "../controllers/tables.controller";
import { authFor as auth } from "../middlewares/auth.middleware";

export const TablesRouter = Router();

TablesRouter.post(
	"/",
	auth(["manager"]),
	TablesValidators.validateNewTable,
	TablesController.newTableHandler
);

TablesRouter.put(
	"/:id",
	auth(["manager"]),
	TablesValidators.validateUpdateTable,
	TablesController.updateTableHandler
);

TablesRouter.delete(
	"/:id",
	auth(["manager"]),
	TablesValidators.validateDeleteTable,
	TablesController.deleteTableHandler
);

TablesRouter.get(
	"/",
	auth(["cashier", "manager"]),
	TablesController.getTablesHandler
);

TablesRouter.post(
	"/:id/session",
	auth(["client", "cashier", "manager"]),
	TablesController.openNewTableSessionHandler
);

TablesRouter.get(
	"/:id/receipt",
	auth(["client", "cashier", "manager"]),
	TablesController.checkoutTableHandler
);

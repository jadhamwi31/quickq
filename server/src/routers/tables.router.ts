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


TablesRouter.delete(
	"/:id",
	auth(["manager"]),
	TablesValidators.validateDeleteTable,
	TablesController.deleteTableHandler
);

TablesRouter.get(
	"/",
	auth(["cashier", "manager", "chef"]),
	TablesController.getTablesHandler
);

TablesRouter.post(
	"/:id/session",
	auth(["cashier", "manager"]),
	TablesController.openNewTableSessionHandler
);

TablesRouter.delete(
	"/:id/session",
	auth(["cashier", "manager"]),
	TablesController.closeTableSessionHandler
);

TablesRouter.post(
	"/session",
	auth(["client"]),
	TablesController.openNewTableSessionHandler
);

TablesRouter.get(
	"/:id/receipt",
	auth(["cashier", "manager"]),
	TablesController.checkoutTableHandler
);

TablesRouter.get(
	"/receipt",
	auth(["client"]),
	TablesController.checkoutTableHandler
);

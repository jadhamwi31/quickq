import { Router } from "express";
import { TablesValidators } from "../validators/tables.validators";
import { TablesController } from "../controllers/tables.controller";

export const TablesRouter = Router();

TablesRouter.post(
	"/",
	TablesValidators.validateNewTable,
	TablesController.newTableHandler
);

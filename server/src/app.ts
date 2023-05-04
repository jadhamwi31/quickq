import dotenv from "dotenv";
import express from "express";
import { createAppDataSource } from "./models";
import { AuthRouter } from "./routers/auth.router";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { errorMiddleware } from "./middlewares/error.middleware";
import { IngredientsRouter } from "./routers/ingredients.router";
import { DishesRouter } from "./routers/dishes.router";
import { CategoriesRouter } from "./routers/categories.router";
import { TablesRouter } from "./routers/tables.router";
import { OrdersRouter } from "./routers/orders.router";
import RedisService from "./services/redis.service";
import { TablesService } from "./services/tables.service";

dotenv.config();

(async function () {
	await createAppDataSource();
	await RedisService.connect();
	const app = express();

	// middlewares
	app.use(cors({ origin: "http://localhost:3000" }));
	app.use(json());
	app.use(urlencoded({ extended: false }));

	// routers
	app.use("/auth", AuthRouter);
	app.use("/ingredients", IngredientsRouter);
	app.use("/dishes", DishesRouter);
	app.use("/categories", CategoriesRouter);
	app.use("/tables", TablesRouter);
	app.use("/orders", OrdersRouter);

	app.use(errorMiddleware);

	app.listen(80, () => {
		console.log(`Listening on port 80`);
	});
})();

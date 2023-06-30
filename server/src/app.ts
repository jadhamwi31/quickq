import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import { authFor } from "./middlewares/auth.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { createAppDataSource } from "./models";
import { AuthRouter } from "./routers/auth.router";
import { BrandRouter } from "./routers/brand.router";
import { CacheRouter } from "./routers/cache.router";
import { CategoriesRouter } from "./routers/categories.router";
import { DishesRouter } from "./routers/dishes.router";
import { IngredientsRouter } from "./routers/ingredients.router";
import { InventoryRouter } from "./routers/inventory.router";
import { MenuRouter } from "./routers/menu.router";
import { OrdersRouter } from "./routers/orders.router";
import { PaymentRouter } from "./routers/payment.router";
import { TablesRouter } from "./routers/tables.router";
import { UsersRouter } from "./routers/users.router";
import RedisService from "./services/redis.service";
import { imagesDirectory } from "./services/upload.service";
import WebsocketService from "./services/websocket.service";
import requestContext from "express-http-context";
import {AiRouter} from "./routers/ai.router";

dotenv.config();

(async function () {
	await createAppDataSource();
	await RedisService.connect();
	const app = express();

	// middlewares
	app.use(requestContext.middleware);
	app.use(morgan("tiny"));
	app.use(cors({ origin: "http://localhost:3000", credentials: true }));
	app.use(json());

	app.use(urlencoded({ extended: true }));
	app.use(cookieParser());

	// routers
	app.use("/auth", AuthRouter);
	app.use("/ingredients", IngredientsRouter);
	app.use("/dishes", DishesRouter);
	app.use("/categories", CategoriesRouter);
	app.use("/tables", TablesRouter);
	app.use("/orders", OrdersRouter);
	app.use("/payments", PaymentRouter);
	app.use("/inventory", InventoryRouter);
	app.use("/menu", MenuRouter);
	app.use("/cache", CacheRouter);
	app.use("/users", UsersRouter);
	app.use("/brand", BrandRouter);
	app.use("/images", express.static(imagesDirectory));
	app.use("/ai",AiRouter);
	app.use(errorMiddleware);
	const port = process.env.SERVER_PORT;

	const httpServer = createServer(app);

	WebsocketService.init(httpServer);

	httpServer.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
})();

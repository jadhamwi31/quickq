"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middlewares/error.middleware");
const models_1 = require("./models");
const auth_router_1 = require("./routers/auth.router");
const brand_router_1 = require("./routers/brand.router");
const cache_router_1 = require("./routers/cache.router");
const categories_router_1 = require("./routers/categories.router");
const dishes_router_1 = require("./routers/dishes.router");
const ingredients_router_1 = require("./routers/ingredients.router");
const inventory_router_1 = require("./routers/inventory.router");
const menu_router_1 = require("./routers/menu.router");
const orders_router_1 = require("./routers/orders.router");
const payment_router_1 = require("./routers/payment.router");
const tables_router_1 = require("./routers/tables.router");
const users_router_1 = require("./routers/users.router");
const redis_service_1 = __importDefault(require("./services/redis.service"));
const upload_service_1 = require("./services/upload.service");
const websocket_service_1 = __importDefault(require("./services/websocket.service"));
const express_http_context_1 = __importDefault(require("express-http-context"));
const ai_router_1 = require("./routers/ai.router");
dotenv_1.default.config();
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, models_1.createAppDataSource)();
        yield redis_service_1.default.connect();
        const app = (0, express_1.default)();
        // middlewares
        app.use(express_http_context_1.default.middleware);
        app.use((0, morgan_1.default)("tiny"));
        app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
        app.use((0, body_parser_1.json)());
        app.use((0, body_parser_1.urlencoded)({ extended: true }));
        app.use((0, cookie_parser_1.default)());
        // routers
        app.use("/auth", auth_router_1.AuthRouter);
        app.use("/ingredients", ingredients_router_1.IngredientsRouter);
        app.use("/dishes", dishes_router_1.DishesRouter);
        app.use("/categories", categories_router_1.CategoriesRouter);
        app.use("/tables", tables_router_1.TablesRouter);
        app.use("/orders", orders_router_1.OrdersRouter);
        app.use("/payments", payment_router_1.PaymentRouter);
        app.use("/inventory", inventory_router_1.InventoryRouter);
        app.use("/menu", menu_router_1.MenuRouter);
        app.use("/cache", cache_router_1.CacheRouter);
        app.use("/users", users_router_1.UsersRouter);
        app.use("/brand", brand_router_1.BrandRouter);
        app.use("/images", express_1.default.static(upload_service_1.imagesDirectory));
        app.use("/ai", ai_router_1.AiRouter);
        app.use(error_middleware_1.errorMiddleware);
        const port = process.env.SERVER_PORT;
        const httpServer = (0, http_1.createServer)(app);
        websocket_service_1.default.init(httpServer);
        httpServer.listen(80, () => {
            console.log(`Listening on port ${port}`);
        });
    });
})();

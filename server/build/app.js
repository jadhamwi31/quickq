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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const models_1 = require("./models");
const auth_router_1 = require("./routers/auth.router");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const error_middleware_1 = require("./middlewares/error.middleware");
const ingredients_router_1 = require("./routers/ingredients.router");
const dishes_router_1 = require("./routers/dishes.router");
const categories_router_1 = require("./routers/categories.router");
const tables_router_1 = require("./routers/tables.router");
const orders_router_1 = require("./routers/orders.router");
const redis_service_1 = __importDefault(require("./services/redis.service"));
dotenv_1.default.config();
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, models_1.createAppDataSource)();
        yield redis_service_1.default.connect();
        const app = (0, express_1.default)();
        // middlewares
        app.use((0, cors_1.default)({ origin: "http://localhost:3000" }));
        app.use((0, body_parser_1.json)());
        app.use((0, body_parser_1.urlencoded)({ extended: false }));
        // routers
        app.use("/auth", auth_router_1.AuthRouter);
        app.use("/ingredients", ingredients_router_1.IngredientsRouter);
        app.use("/dishes", dishes_router_1.DishesRouter);
        app.use("/categories", categories_router_1.CategoriesRouter);
        app.use("/tables", tables_router_1.TablesRouter);
        app.use("/orders", orders_router_1.OrdersRouter);
        app.use(error_middleware_1.errorMiddleware);
        app.listen(80, () => {
            console.log(`Listening on port 80`);
        });
    });
})();

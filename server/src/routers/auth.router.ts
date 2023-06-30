import { Router } from "express";
import { UserController } from "../controllers/auth.controller";
import { AuthValidators } from "../validators/auth.validators";
import { authFor } from "../middlewares/auth.middleware";

export const AuthRouter = Router();

AuthRouter.post(
	"/login",
	AuthValidators.validateLogin,
	UserController.loginHandler
);

AuthRouter.post(
	"/logout",
	authFor(["manager", "cashier", "chef"]),
	UserController.logoutHandler
);

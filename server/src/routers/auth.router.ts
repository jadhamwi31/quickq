import { Router } from "express";
import { UserController } from "../controllers/auth.controller";
import { AuthValidators } from "../validators/auth.validators";

export const AuthRouter = Router();

AuthRouter.post("/login", AuthValidators.validateLogin, UserController.login);

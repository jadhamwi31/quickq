import { Router } from "express";
import { UsersValidators } from "../validators/users.validators";
import { authFor } from "../middlewares/auth.middleware";
import { UsersController } from "../controllers/users.controller";

export const UsersRouter = Router();

UsersRouter.post(
	"/",
	authFor(["manager"]),
	UsersValidators.validateCreateNewUser,
	UsersController.createNewUserHandler
);

UsersRouter.delete(
	"/",
	authFor(["manager"]),
	UsersValidators.validateDeleteUser,
	UsersController.deleteUserHandler
);

UsersRouter.get("/", authFor(["manager"]), UsersController.getUsersHandler);

UsersRouter.put(
	"/:username?",
	authFor(["manager", "cashier", "chef"]),
	UsersValidators.validateUpdateUser,
	UsersController.updateUserHandler
);

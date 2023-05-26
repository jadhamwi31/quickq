import { Router } from "express";
import { authFor } from "../middlewares/auth.middleware";
import RedisService from "../services/redis.service";

export const CacheRouter = Router();

CacheRouter.delete(
	"/",
	authFor(["manager", "cashier"]),
	async (req, res, next) => {
		try {
			await RedisService.clearCache();
		} catch (e) {
			next(e);
		}
	}
);

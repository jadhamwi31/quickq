import { Router } from "express";
import { authFor } from "../middlewares/auth.middleware";
import { PaymentValidator } from "../validators/payment.validators";
import { PaymentController } from "../controllers/payment.controller";
import { PaymentService } from "../services/payment.service";

export const PaymentRouter = Router();

PaymentRouter.post(
	"/",
	authFor(["cashier", "manager"]),
	PaymentValidator.validateNewPayment,
	PaymentController.newPaymentHandler
);

PaymentRouter.get(
	"/history",
	authFor(["manager"]),
	PaymentController.getPaymentsHistoryHandler
);

PaymentRouter.get(
	"/today",
	authFor(["cashier", "manager"]),
	PaymentController.getPaymentsTodayHandler
);

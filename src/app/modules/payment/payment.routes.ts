import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.get(
  "/init-payment/:appointmentId",
  PaymentController.initPayment
);


router.get('/pnr', PaymentController.validatePayment);

export const PaymentRoutes = router;
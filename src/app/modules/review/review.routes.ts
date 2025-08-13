import express from "express";
import { authValidation } from "../../middlewares/authValidation";
import { UserRole } from "../../../generated/prisma";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post(
  "/",
  authValidation(UserRole.PATIENT),
  ReviewController.createIntoDB
);

router.get(
  "/",
  authValidation(UserRole.DOCTOR),
  ReviewController.getAllReview
);

export const ReviewRoutes = router;

import express from "express";
import { authController } from "./auth.controller";
import { authValidation } from "../../middlewares/authValidation";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshToken);
router.post(
  "/change-password",
  authValidation(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATIENT,
    UserRole.DOCTOR
  ),
  authController.changePassword
);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

export const AuthRoutes = router;

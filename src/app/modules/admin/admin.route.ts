import { authValidation } from "./../../middlewares/authValidation";
import express from "express";
import { adminControllers } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminValidationSchemas } from "./admin.validations";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get(
  "/",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminControllers.getAllFromDB
);
router.get(
  "/:id",
  authValidation(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.getByIdFromDB
);
router.patch(
  "/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(adminValidationSchemas.update),
  adminControllers.updateIntoDB
);
router.delete(
  "/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminControllers.deleteFromDB
);
router.delete(
  "/soft/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminControllers.softDeleteFromDB
);

export const AdminRoutes = router;

import { authValidation } from "./../../middlewares/authValidation";
import express from "express";
import { UserRole } from "../../../generated/prisma";
import { doctorController } from "./doctor.controller";

const router = express.Router();

router.get(
  "/",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorController.getAllFromDB
);
router.get(
  "/:id",
  authValidation(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  doctorController.getByIdFromDB
);
router.patch(
  "/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  //   validateRequest(adminValidationSchemas.update),
  doctorController.updateIntoDB
);
router.delete(
  "/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorController.deleteFromDB
);
router.delete(
  "/soft/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorController.softDeleteFromDB
);

export const DoctorRoutes = router;

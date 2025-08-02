import { authValidation } from "./../../middlewares/authValidation";
import express from "express";
import { UserRole } from "../../../generated/prisma";
import { patientController } from "./patient.controller";

const router = express.Router();

router.get(
  "/",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  patientController.getAllFromDB
);
router.get(
  "/:id",
  authValidation(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  patientController.getByIdFromDB
);
router.patch(
  "/:id",
  authValidation(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  //   validateRequest(adminValidationSchemas.update),
  patientController.updateIntoDB
);

router.delete("/:id", patientController.deleteFromDB);

router.delete(
  "/soft/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  patientController.softDeleteFromDB
);
export const PatientRoutes = router;

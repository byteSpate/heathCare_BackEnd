import express from "express";
import { MetaController } from "./meta.controller";
import { authValidation } from "../../middlewares/authValidation";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get(
  "/",
  authValidation(UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT,UserRole.SUPER_ADMIN),
  MetaController.fetcheDashboardMetaData
);




export const MetaRoutes = router;
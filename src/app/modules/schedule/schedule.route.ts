import { Doctor } from './../../../generated/prisma/index.d';
import { authValidation } from "./../../middlewares/authValidation";
import express from "express";
import { scheduleController } from "./schedule.controller";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get('/',authValidation(UserRole.DOCTOR),scheduleController.getAllFromDB)

router.post("/",authValidation(UserRole.DOCTOR), scheduleController.createIntoDB);

export const ScheduleRoutes = router;

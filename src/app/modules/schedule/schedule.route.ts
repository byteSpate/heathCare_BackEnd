import { Doctor } from './../../../generated/prisma/index.d';
import { authValidation } from "./../../middlewares/authValidation";
import express from "express";
import { scheduleController } from "./schedule.controller";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get('/',authValidation(UserRole.ADMIN,UserRole.DOCTOR),scheduleController.getAllFromDB)

router.get('/:id',authValidation(UserRole.ADMIN,UserRole.DOCTOR),scheduleController.getByIdFromDB)

router.post("/",authValidation(UserRole.ADMIN,UserRole.DOCTOR), scheduleController.createIntoDB);


router.delete(
    '/:id',
    authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    scheduleController.deleteFromDB
);
export const ScheduleRoutes = router;

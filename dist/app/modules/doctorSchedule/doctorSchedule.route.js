"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const doctorSchedule_controller_1 = require("./doctorSchedule.controller");
const authValidation_1 = require("../../middlewares/authValidation");
const prisma_1 = require("../../../generated/prisma");
const router = express_1.default.Router();
router.get('/', (0, authValidation_1.authValidation)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.DOCTOR, prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.PATIENT), doctorSchedule_controller_1.doctorScheduleController.getAllFromDB);
router.get('/my-schedule', (0, authValidation_1.authValidation)(prisma_1.UserRole.DOCTOR), doctorSchedule_controller_1.doctorScheduleController.getMySchedule);
router.post("/", (0, authValidation_1.authValidation)(prisma_1.UserRole.DOCTOR), doctorSchedule_controller_1.doctorScheduleController.createIntoDB);
router.delete('/:id', (0, authValidation_1.authValidation)(prisma_1.UserRole.DOCTOR), doctorSchedule_controller_1.doctorScheduleController.deleteFromDB);
exports.DoctorScheduleRoutes = router;

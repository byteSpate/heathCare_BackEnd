"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const appointment_controller_1 = require("./appointment.controller");
const authValidation_1 = require("../../middlewares/authValidation");
const prisma_1 = require("../../../generated/prisma");
const validateRequest_1 = require("../../middlewares/validateRequest");
const appointment_validation_1 = require("./appointment.validation");
const router = express_1.default.Router();
router.post('/', (0, authValidation_1.authValidation)(prisma_1.UserRole.PATIENT), (0, validateRequest_1.validateRequest)(appointment_validation_1.AppointmentValidation.createAppointment), appointment_controller_1.AppointmentController.createAppointment);
router.get('/', (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), appointment_controller_1.AppointmentController.getAllFromDB);
router.get('/my-appointment', (0, authValidation_1.authValidation)(prisma_1.UserRole.PATIENT, prisma_1.UserRole.DOCTOR), appointment_controller_1.AppointmentController.getMyAppointment);
router.patch('/status/:id', (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN, prisma_1.UserRole.DOCTOR), appointment_controller_1.AppointmentController.changeAppointmentStatus);
exports.AppointmentRoutes = router;

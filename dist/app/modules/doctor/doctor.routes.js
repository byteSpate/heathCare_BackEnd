"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRoutes = void 0;
const authValidation_1 = require("./../../middlewares/authValidation");
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../../generated/prisma");
const doctor_controller_1 = require("./doctor.controller");
const router = express_1.default.Router();
router.get("/", (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), doctor_controller_1.doctorController.getAllFromDB);
router.get("/:id", (0, authValidation_1.authValidation)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.SUPER_ADMIN), doctor_controller_1.doctorController.getByIdFromDB);
router.patch("/:id", (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN, prisma_1.UserRole.DOCTOR), 
//   validateRequest(adminValidationSchemas.update),
doctor_controller_1.doctorController.updateIntoDB);
router.delete("/:id", (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), doctor_controller_1.doctorController.deleteFromDB);
router.delete("/soft/:id", (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), doctor_controller_1.doctorController.softDeleteFromDB);
exports.DoctorRoutes = router;

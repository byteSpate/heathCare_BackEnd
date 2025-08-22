"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authValidation_1 = require("../../middlewares/authValidation");
const prisma_1 = require("../../../generated/prisma");
const prescription_controller_1 = require("./prescription.controller");
const router = express_1.default.Router();
router.post("/create-prescription", (0, authValidation_1.authValidation)(prisma_1.UserRole.DOCTOR), prescription_controller_1.PrescriptionController.createIntoDB);
router.get("/my-prescription", (0, authValidation_1.authValidation)(prisma_1.UserRole.DOCTOR, prisma_1.UserRole.PATIENT), prescription_controller_1.PrescriptionController.getMyPrescription);
exports.PrescriptionRoutes = router;

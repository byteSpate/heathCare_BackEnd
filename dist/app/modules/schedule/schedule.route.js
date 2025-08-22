"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleRoutes = void 0;
const authValidation_1 = require("./../../middlewares/authValidation");
const express_1 = __importDefault(require("express"));
const schedule_controller_1 = require("./schedule.controller");
const prisma_1 = require("../../../generated/prisma");
const router = express_1.default.Router();
router.get('/', (0, authValidation_1.authValidation)(prisma_1.UserRole.DOCTOR), schedule_controller_1.scheduleController.getAllFromDB);
router.get('/:id', (0, authValidation_1.authValidation)(prisma_1.UserRole.DOCTOR), schedule_controller_1.scheduleController.getByIdFromDB);
router.post("/", (0, authValidation_1.authValidation)(prisma_1.UserRole.DOCTOR), schedule_controller_1.scheduleController.createIntoDB);
router.delete('/:id', (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), schedule_controller_1.scheduleController.deleteFromDB);
exports.ScheduleRoutes = router;

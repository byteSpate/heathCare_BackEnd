"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const meta_controller_1 = require("./meta.controller");
const authValidation_1 = require("../../middlewares/authValidation");
const prisma_1 = require("../../../generated/prisma");
const router = express_1.default.Router();
router.get("/", (0, authValidation_1.authValidation)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.DOCTOR, prisma_1.UserRole.PATIENT, prisma_1.UserRole.SUPER_ADMIN), meta_controller_1.MetaController.fetcheDashboardMetaData);
exports.MetaRoutes = router;

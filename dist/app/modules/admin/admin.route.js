"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const authValidation_1 = require("./../../middlewares/authValidation");
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const admin_validations_1 = require("./admin.validations");
const prisma_1 = require("../../../generated/prisma");
const router = express_1.default.Router();
router.get("/", (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), admin_controller_1.adminControllers.getAllFromDB);
router.get("/:id", (0, authValidation_1.authValidation)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.SUPER_ADMIN), admin_controller_1.adminControllers.getByIdFromDB);
router.patch("/:id", (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(admin_validations_1.adminValidationSchemas.update), admin_controller_1.adminControllers.updateIntoDB);
router.delete("/:id", (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), admin_controller_1.adminControllers.deleteFromDB);
router.delete("/soft/:id", (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), admin_controller_1.adminControllers.softDeleteFromDB);
exports.AdminRoutes = router;

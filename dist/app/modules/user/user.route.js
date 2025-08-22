"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const prisma_1 = require("../../../generated/prisma");
const authValidation_1 = require("../../middlewares/authValidation");
const fileUploader_1 = require("../../../helpers/fileUploader");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.get("/", user_controller_1.userController.getAllFromDB);
router.get("/me", (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN, prisma_1.UserRole.DOCTOR, prisma_1.UserRole.PATIENT), user_controller_1.userController.getMe);
router.patch("/update-my-profile", (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN, prisma_1.UserRole.DOCTOR, prisma_1.UserRole.PATIENT), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controller_1.userController.updateMyProfile(req, res, next);
});
router.post("/create-admin", 
// authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.userValidations.createAdmin.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createAdmin(req, res, next);
});
router.post("/create-doctor", (0, authValidation_1.authValidation)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.userValidations.createDoctor.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createDoctor(req, res, next);
});
router.post("/create-patient", fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.userValidations.createPatient.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createPatient(req, res, next);
});
router.patch("/:id/status", (req, res, next) => {
    req.body = user_validation_1.userValidations.changeStatus.parse(req.body);
    return user_controller_1.userController.changeStatus(req, res, next);
});
exports.UserRoutes = router;

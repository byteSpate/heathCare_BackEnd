import { status } from "http-status";
import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { UserRole, UserStatus } from "../../../generated/prisma";
import { authValidation } from "../../middlewares/authValidation";
import { fileUploader } from "../../../helpers/fileUploader";
import { userValidations } from "./user.validation";

const router = express.Router();

router.get("/", userController.getAllFromDB);

router.get(
  "/me",
  authValidation(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  userController.getMe
);

router.patch(
  "/update-my-profile",
  authValidation(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return userController.updateMyProfile(req, res, next);
  }
);

router.post(
  "/create-admin",
  // authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createAdmin.parse(JSON.parse(req.body.data));
    return userController.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createDoctor.parse(JSON.parse(req.body.data));
    return userController.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createPatient.parse(JSON.parse(req.body.data));
    return userController.createPatient(req, res, next);
  }
);

router.patch(
  "/:id/status",
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.changeStatus.parse(req.body);
    return userController.changeStatus(req, res, next);
  }
);

export const UserRoutes = router;

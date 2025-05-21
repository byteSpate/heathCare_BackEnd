import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { UserRole, UserStatus } from "../../../generated/prisma";
import { authValidation } from "../../middlewares/authValidation";
import multer from "multer";
import path from "path";
import { fileUploader } from "../../../helpers/fileUploader";

const router = express.Router();

router.post(
  "/",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  userController.createAdmin
);

export const UserRoutes = router;

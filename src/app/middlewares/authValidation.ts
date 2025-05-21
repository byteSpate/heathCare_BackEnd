import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import status from "http-status";

export const authValidation = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(status.UNAUTHORIZED, "You are not authorized");
      }
      const userData = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );
      req.user = userData;
      if (roles.length && !roles.includes(userData.role)) {
        throw new ApiError(status.FORBIDDEN, "You are not authorized");
      }
      next();
    } catch (error) {
      Error;
      next(error);
    }
  };
};

import { jwtHelpers } from "./../../../helpers/jwtHelpers";
import { prisma } from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { UserStatus } from "../../../generated/prisma";
import config from "../../../config";
import sendEmail from "./sendEmail";
import ApiError from "../../errors/ApiError";
import status from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isPasswordMatch: Boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPasswordMatch) {
    throw new Error("Password did not match ");
  }

  const accessToken = jwt.sign(
    { email: userData.email, role: userData.role },
    config.jwt.jwt_secret as Secret,
    {
      algorithm: "HS256",
      expiresIn: "30d",
    }
  );

  const refreshToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    {
      algorithm: "HS256",
      expiresIn: "30d",
    }
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: userData.needsPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;

  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (error) {
    throw new Error("You are not authorized");
  }

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });
  const accessToken = jwt.sign(
    { email: isUserExist.email, role: isUserExist.role },
    config.jwt.jwt_secret as Secret,
    {
      algorithm: "HS256",
      expiresIn: "30d",
    }
  );

  return {
    accessToken,
    needsPasswordChange: isUserExist.needsPasswordChange,
  };
};

const changePassword = async (
  userData: any,
  postData: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const isUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: userData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordMatch: Boolean = await bcrypt.compare(
    postData.oldPassword,
    isUser.password
  );
  if (!isPasswordMatch) {
    throw new Error("Password did not match");
  }

  const hashedPassword = await bcrypt.hash(postData.newPassword, 10);

  const updateUser = await prisma.user.update({
    where: {
      email: isUser.email,
    },
    data: {
      password: hashedPassword,
      needsPasswordChange: false,
    },
  });
  return {
    message: "Password Changed Successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new ApiError(status.UNAUTHORIZED, "You are not a user");
  }
  const resetToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_secret as Secret,
    {
      algorithm: "HS256",
      expiresIn: "15m",
    }
  );

  const resetLink =
    config.reset_link + `?email=${userData.email}&token=${resetToken}`;

  sendEmail(userData.email, resetLink);
};

const resetPassword = async (
  token: string,
  payload: {
    email: string;
    password: string;
  }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(status.UNAUTHORIZED, "You are not authorized");
  }

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(status.FORBIDDEN, "Forbidden");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const updatePassword = await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return updatePassword;
};

export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};

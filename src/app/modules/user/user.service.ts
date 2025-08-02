import * as bcrypt from "bcrypt";
import { Prisma, UserRole, UserStatus } from "../../../generated/prisma";
import { prisma } from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";
import { Request } from "express";
import { IQuery } from "../admin/admin.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPagination } from "../../interfaces/paginationInterface";
import { userSearchAbleFields } from "./user.constant";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { IAuthUser } from "../../interfaces/common";

const createAdmin = async (req: Request) => {
  console.log(req.body)
  const file = req.file as TFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url as string;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const adminData = req.body.admin;

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });
    const admin = await tx.admin.create({
      data: adminData,
    });
    return admin;
  });

  return {
    result,
    message: "Admin created successfully",
    status: 200,
    success: true,
  };
};

const createDoctor = async (req: Request) => {
  const file = req.file as TFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url as string;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };
  const doctorData = req.body.doctor;

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });
    const doctor = await tx.doctor.create({
      data: doctorData,
    });
    return doctor;
  });

  return {
    result,
    message: "Doctor created successfully",
    status: 200,
    success: true,
  };
};

const createPatient = async (req: Request) => {
  const file = req.file as TFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url as string;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };
  const patientData = req.body.patient;

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });
    const patient = await tx.patient.create({
      data: patientData,
    });
    return patient;
  });

  return {
    result,
    message: "Patient created successfully",
    status: 200,
    success: true,
  };
};

const getAllFromDB = async (query: IQuery, options: IPagination) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filteredData } = query;
  const andConditions: Prisma.UserWhereInput[] = [];

  if (query?.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: query?.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filteredData).length > 0) {
    andConditions.push({
      AND: Object.keys(filteredData).map((field) => ({
        [field]: {
          equals: filteredData[field as keyof typeof filteredData],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      password: false,
      role: true,
      needsPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      doctor: true,
      patient: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeStatus = async (id: string, req: Request) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  if (!isUserExist) {
    throw new ApiError(status.NOT_FOUND, "User not found");
  }

  const updateStatusResult = await prisma.user.update({
    where: {
      email: isUserExist.email,
    },
    data: {
      status: req.body.status,
    },
  });

  return updateStatusResult;
};

const getMe = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needsPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  let profileInfo;
  if (userInfo.role == "SUPER_ADMIN" || userInfo.role == "ADMIN") {
    profileInfo = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role == "DOCTOR") {
    profileInfo = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role == "PATIENT") {
    profileInfo = await prisma.patient.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  }

  return {
    ...userInfo,
    ...profileInfo,
  };
};

const updateMyProfile = async (user: IAuthUser, req: Request) => {
  console.log(user);

  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });
  const file = req.file as TFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url as string;
  }
  let profileInfo;
  if (userInfo.role == "SUPER_ADMIN" || userInfo.role == "ADMIN") {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role == "DOCTOR") {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role == "PATIENT") {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }

  return {
    ...profileInfo,
  };
};
export const userServices = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeStatus,
  getMe,
  updateMyProfile,
};

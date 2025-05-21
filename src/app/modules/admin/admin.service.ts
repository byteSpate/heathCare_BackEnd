import { Admin, Prisma, UserStatus } from "../../../generated/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { prisma } from "../../../shared/prisma";
import { IPagination } from "../../interfaces/paginationInterface";
import { adminSearchAbleFields } from "./admin.constant";
import { IQuery } from "./admin.interface";

const getAllFromDB = async (query: IQuery, options: IPagination) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filteredData } = query;
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (query?.searchTerm) {
    andConditions.push({
      OR: adminSearchAbleFields.map((field) => ({
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

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.AdminWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.admin.count({
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

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      // isDeleted: false,
    },
  });
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (id: string, data: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (tx) => {
    const adminDeleteData = await tx.admin.delete({
      where: {
        id,
      },
    });
    await tx.user.delete({
      where: {
        email: adminDeleteData.email,
      },
    });
    return adminDeleteData;
  });
  return result;
};

const softDeleteFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const updateAdmin = await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    const updateUser = await tx.user.update({
      where: {
        email: updateAdmin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return updateUser;
  });

  return result;
};

export const adminServices = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};

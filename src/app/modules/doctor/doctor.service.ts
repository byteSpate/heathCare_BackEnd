import { Admin, Doctor, Prisma, UserStatus } from "../../../generated/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { prisma } from "../../../shared/prisma";
import { IPagination } from "../../interfaces/paginationInterface";
import { IQuery } from "../admin/admin.interface";
import { doctorSearchAbleFields } from "./doctor.constant";

const getAllFromDB = async (query: IQuery, options: IPagination) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filteredData } = query;
  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (query?.searchTerm) {
    andConditions.push({
      OR: doctorSearchAbleFields.map((field) => ({
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

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.doctor.count({
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
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (tx) => {
    const doctorDeleteData = await tx.doctor.delete({
      where: {
        id,
      },
    });
    await tx.user.delete({
      where: {
        email: doctorDeleteData.email,
      },
    });
    return doctorDeleteData;
  });
  return result;
};

const softDeleteFromDB = async (id: string) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const updateDoctor = await tx.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    const updateUser = await tx.user.update({
      where: {
        email: updateDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return updateUser;
  });

  return result;
};

type SpecialtyPayload = {
  specialtiesId: string;
  isDeleted?: boolean;
};

type DoctorUpdatePayload = Partial<Doctor> & {
  specialties?: SpecialtyPayload[];
};

const updateIntoDB = async (id: string, payload: DoctorUpdatePayload) => {
  const { specialties = [], ...doctorInfo } = payload;
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: {
        id,
      },
      data: doctorInfo,
    });

    if (specialties && specialties.length > 0) {
      const deleteSpecialty = specialties.filter(
        (specialty) => specialty.isDeleted
      );
      for (const specialty of deleteSpecialty) {
        await tx.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }

      //create specialties
      const createSpecialties = specialties.filter(
        (specialty) => !specialty.isDeleted
      );
      for (const specialty of createSpecialties) {
        await tx.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id: id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

export const doctorService = {
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
  softDeleteFromDB,
  updateIntoDB,
};

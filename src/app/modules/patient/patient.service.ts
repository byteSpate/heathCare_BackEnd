import {
  Admin,
  Doctor,
  MedicalReport,
  Patient,
  PatientHealthData,
  Prisma,
  UserStatus,
} from "../../../generated/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { prisma } from "../../../shared/prisma";
import { IPagination } from "../../interfaces/paginationInterface";
import { IQuery } from "../admin/admin.interface";
import { patientSearchAbleFields } from "./patient.constant";

const getAllFromDB = async (query: IQuery, options: IPagination) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filteredData } = query;
  const andConditions: Prisma.PatientWhereInput[] = [];

  if (query?.searchTerm) {
    andConditions.push({
      OR: patientSearchAbleFields.map((field) => ({
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

  //   if (specialties && specialties.length > 0) {
  //     andConditions.push({
  //       doctorSpecialties: {
  //         some: {
  //           specialties: {
  //             title: {
  //               contains: specialties,
  //               mode: "insensitive",
  //             },
  //           },
  //         },
  //       },
  //     });
  //   }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.patient.count({
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
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.patient.findUnique({
    where: {
      id,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  return result;
};

type PatientUpdatePayload = Partial<Patient> & {
  patientHealthData?: PatientHealthData;
  medicalReport?: MedicalReport;
};

const updateIntoDB = async (id: string, payload: PatientUpdatePayload) => {
  const { patientHealthData, medicalReport, ...patientData } = payload;
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.$transaction(async (tx) => {
    await tx.patient.update({
      where: {
        id,
      },
      data: patientData,
    });

    console.log(patientHealthData);

    //create or update patientHealthData
    if (patientHealthData) {
      await tx.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientInfo.id },
      });
    }

    if (medicalReport) {
      await tx.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });
  const result = await prisma.patient.findUnique({
    where: {
      id: id,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (tx) => {
    //delete medical report
    await tx.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });
    if (patient.patientHealthData)
      // delete patient health data
      await tx.patientHealthData.delete({
        where: {
          patientId: id,
        },
      });

    const patientDeleteData = await tx.patient.delete({
      where: {
        id,
      },
    });
    await tx.user.delete({
      where: {
        email: patientDeleteData?.email,
      },
    });
    return patientDeleteData;
  });
  return result;
};

const softDeleteFromDB = async (id: string) => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const updatePatient = await tx.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    const updateUser = await tx.user.update({
      where: {
        email: updatePatient.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return updateUser;
  });

  return result;
};

export const patientServices = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};

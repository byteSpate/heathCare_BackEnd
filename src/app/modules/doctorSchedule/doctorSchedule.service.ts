import { Prisma } from "../../../generated/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import { IPagination } from "../../interfaces/paginationInterface";

const createIntoDB = async (
  user: any,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorSchedules = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorSchedules,
  });

  return result;
};

const getMySchedule = async (
  filters: any,
  options: IPagination,
  user: IAuthUser
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filteredData } = filters;
  const andConditions: Prisma.DoctorScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filteredData).length > 0) {
    if (
      typeof filteredData.isBooked === "string" &&
      filteredData.isBooked === "true"
    ) {
      filteredData.isBooked = true;
    } else if (
      typeof filteredData.isBooked === "string" &&
      filteredData.isBooked === "false"
    ) {
      filteredData.isBooked = false;
    }

    andConditions.push({
      AND: Object.keys(filteredData).map((field) => ({
        [field]: {
          equals: filteredData[field as keyof typeof filteredData],
        },
      })),
    });
  }

  const whereConditions: Prisma.DoctorScheduleWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.doctorSchedule.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    // orderBy:
    //   sortBy && sortOrder
    //     ? {
    //         [sortBy]: sortOrder,
    //       }
    //     : {

    //     },
  });

  const total = await prisma.doctorSchedule.count({
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

const deleteFromDB = async (user: IAuthUser, scheduleId: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedule.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId,
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new ApiError(400, "This schedule is already booked");
  }

  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId,
      },
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: any,
  options: IPagination,
  user: IAuthUser
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filteredData } = filters;
  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
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

  const whereConditions: Prisma.ScheduleWhereInput = {
    AND: andConditions,
  };

  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
  });

  const doctorSchedulesIds = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );



  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorSchedulesIds,
      },
    },
    skip: skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorSchedulesIds,
      },
    },
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

export const doctorScheduleServices = {
  createIntoDB,
  getMySchedule,
  deleteFromDB,
  getAllFromDB,
};

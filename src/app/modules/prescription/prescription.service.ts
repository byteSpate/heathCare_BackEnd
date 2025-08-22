import { User, UserRole, Patient } from "./../../../generated/prisma/index.d";
import httpStatus from "http-status";
import { AppointmentStatus, PaymentStatus } from "../../../generated/prisma";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import { IPagination } from "../../interfaces/paginationInterface";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createIntoDB = async (user: IAuthUser, payload: any) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  if (!(user.email === appointmentData.doctor.email)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You are not allowed to create a prescription for this appointment"
    );
  }

  const prescriptionData = {
    appointmentId: appointmentData.id,
    patientId: appointmentData.patientId,
    doctorId: appointmentData.doctorId,
    ...payload,
  };

  if (prescriptionData) {
    const result = await prisma.prescription.create({
      data: prescriptionData,
      include: {
        doctor: true,
        patient: true,
        appointment: true,
      },
    });

    return result;
  }
};

const getMyPrescription = async (user: IAuthUser, options: IPagination) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user.email,
      },
    },
    skip: skip,
    take: limit,
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.prescription.count({});
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const prescriptionServices = {
  createIntoDB,
  getMyPrescription,
};

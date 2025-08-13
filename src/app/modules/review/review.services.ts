import { User, UserRole, Patient } from "./../../../generated/prisma/index.d";
import httpStatus from "http-status";
import { AppointmentStatus, PaymentStatus } from "../../../generated/prisma";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import { IPagination } from "../../interfaces/paginationInterface";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createIntoDB = async (user: IAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });

  if (!(patientData.id === appointmentData.patientId)) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to create a review for this appointment"
    );
  }

  const reviewData = {
    appointmentId: appointmentData.id,
    doctorId: appointmentData.doctorId,
    patientId: appointmentData.patientId,
    rating: payload.rating,
    comment: payload.comment,
  };

  if (!reviewData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  await prisma.$transaction(async (tx) => {
    const result = await tx.review.create({
      data: reviewData,
    });

    const averageRating = await tx.review.aggregate({
      _avg: {
        rating: true,
      },
    });
    await tx.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });
    return result
  });
};

const getAllReview = async (user: IAuthUser, options: IPagination) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  if (!doctorData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  const result = await prisma.review.findMany({
    where: {
      doctorId: doctorData.id,
    },
    skip: skip,
    take: limit,
    include: {
      patient: true,
      doctor: true,
      appointment: true,
    },
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  const total = await prisma.review.count({});
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const ReviewServices = {
  createIntoDB,
  getAllReview,
};

import { PaymentStatus, UserRole } from "../../../generated/prisma";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const fetcheDashboardMetaData = async (user: IAuthUser) => {
  let result;
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      result = await getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      result = await getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      result = await getDoctorMetaData(user as IAuthUser);
      break;
    case UserRole.PATIENT:
      result = await getPatientMetaData(user as IAuthUser);
      break;
    default:
      throw new Error("Invalid user role!");
  }

  return result;
};

const getSuperAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCoount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const adminCount = await prisma.admin.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  // const barChartData = await getBarChartData();
  // const pieChartData = await getPieChartData();
  return {
    appointmentCount,
    patientCoount,
    doctorCount,
    paymentCount,
    totalRevenue: totalRevenue._sum.amount,
    adminCount,
    // barChartData,
    // pieChartData,
  };
};
const getAdminMetaData = async () => {
  // const barChartData = await getBarChartData();
  // const pieChartData = await getPieChartData();
  const appointmentCount = await prisma.appointment.count();
  const patientCoount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  return {
    appointmentCount,
    patientCoount,
    doctorCount,
    paymentCount,
    // barChartData,
    // pieChartData,
    totalRevenue,
  };
};
const getDoctorMetaData = async (user: IAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: PaymentStatus.PAID,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));

  return {
    appointmentCount,
    patientCount: patientCount.length,
    reviewCount,
    totalRevenue: totalRevenue._sum.amount,
    formattedAppointmentStatusDistribution,
  };
};

const getPatientMetaData = async (user: IAuthUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      patientId: patientData.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));

  return {
    appointmentCount,
    reviewCount,
    formattedAppointmentStatusDistribution,
  };
};

// const getBarChartData = async () => {
//   const appointmentCountByMonth = await prisma.$queryRaw`
//   SELECT DATE_TRUNC('month', "createdAt") AS month,
//          CAST(COUNT(*) AS INT) AS count
//   FROM "appointments"
//   GROUP BY month
//   ORDER BY month ASC;
// `;

//   return appointmentCountByMonth;
// };

// const getPieChartData = async () => {
//   const appointmentStatusDistribution = await prisma.appointment.groupBy({
//     by: ["status"],
//     _count: { id: true },
//   });

//   const formattedAppointmentStatusDistribution =
//     appointmentStatusDistribution.map((count) => ({
//       status: count.status,
//       count: Number(count._count.id),
//     }));

//   return formattedAppointmentStatusDistribution;
// };
export const MetaServices = {
  fetcheDashboardMetaData,
};

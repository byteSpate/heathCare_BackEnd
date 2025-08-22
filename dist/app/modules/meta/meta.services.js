"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaServices = void 0;
const prisma_1 = require("../../../generated/prisma");
const prisma_2 = require("../../../shared/prisma");
const fetcheDashboardMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    switch (user.role) {
        case prisma_1.UserRole.SUPER_ADMIN:
            result = yield getSuperAdminMetaData();
            break;
        case prisma_1.UserRole.ADMIN:
            result = yield getAdminMetaData();
            break;
        case prisma_1.UserRole.DOCTOR:
            result = yield getDoctorMetaData(user);
            break;
        case prisma_1.UserRole.PATIENT:
            result = yield getPatientMetaData(user);
            break;
        default:
            throw new Error("Invalid user role!");
    }
    return result;
});
const getSuperAdminMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentCount = yield prisma_2.prisma.appointment.count();
    const patientCoount = yield prisma_2.prisma.patient.count();
    const doctorCount = yield prisma_2.prisma.doctor.count();
    const paymentCount = yield prisma_2.prisma.payment.count();
    const adminCount = yield prisma_2.prisma.admin.count();
    const totalRevenue = yield prisma_2.prisma.payment.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            status: prisma_1.PaymentStatus.PAID,
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
});
const getAdminMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    // const barChartData = await getBarChartData();
    // const pieChartData = await getPieChartData();
    const appointmentCount = yield prisma_2.prisma.appointment.count();
    const patientCoount = yield prisma_2.prisma.patient.count();
    const doctorCount = yield prisma_2.prisma.doctor.count();
    const paymentCount = yield prisma_2.prisma.payment.count();
    const totalRevenue = yield prisma_2.prisma.payment.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            status: prisma_1.PaymentStatus.PAID,
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
});
const getDoctorMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_2.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const appointmentCount = yield prisma_2.prisma.appointment.count({
        where: {
            doctorId: doctorData.id,
        },
    });
    const patientCount = yield prisma_2.prisma.appointment.groupBy({
        by: ["patientId"],
    });
    const reviewCount = yield prisma_2.prisma.review.count({
        where: {
            doctorId: doctorData.id,
        },
    });
    const totalRevenue = yield prisma_2.prisma.payment.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            appointment: {
                doctorId: doctorData.id,
            },
            status: prisma_1.PaymentStatus.PAID,
        },
    });
    const appointmentStatusDistribution = yield prisma_2.prisma.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: {
            doctorId: doctorData.id,
        },
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map((count) => ({
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
});
const getPatientMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield prisma_2.prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const appointmentCount = yield prisma_2.prisma.appointment.count({
        where: {
            patientId: patientData.id,
        },
    });
    const reviewCount = yield prisma_2.prisma.review.count({
        where: {
            patientId: patientData.id,
        },
    });
    const appointmentStatusDistribution = yield prisma_2.prisma.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: {
            patientId: patientData.id,
        },
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map((count) => ({
        status: count.status,
        count: Number(count._count.id),
    }));
    return {
        appointmentCount,
        reviewCount,
        formattedAppointmentStatusDistribution,
    };
});
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
exports.MetaServices = {
    fetcheDashboardMetaData,
};

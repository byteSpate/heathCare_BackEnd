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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptionServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../../generated/prisma");
const prisma_2 = require("../../../shared/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentData = yield prisma_2.prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            paymentStatus: prisma_1.PaymentStatus.PAID,
        },
        include: {
            doctor: true,
        },
    });
    if (!(user.email === appointmentData.doctor.email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You are not allowed to create a prescription for this appointment");
    }
    const prescriptionData = Object.assign({ appointmentId: appointmentData.id, patientId: appointmentData.patientId, doctorId: appointmentData.doctorId }, payload);
    if (prescriptionData) {
        const result = yield prisma_2.prisma.prescription.create({
            data: prescriptionData,
            include: {
                doctor: true,
                patient: true,
                appointment: true,
            },
        });
        return result;
    }
});
const getMyPrescription = (user, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = yield prisma_2.prisma.prescription.findMany({
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
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield prisma_2.prisma.prescription.count({});
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.prescriptionServices = {
    createIntoDB,
    getMyPrescription,
};

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
exports.ReviewServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../../shared/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const appointmentData = yield prisma_1.prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
        },
    });
    if (!(patientData.id === appointmentData.patientId)) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You are not allowed to create a review for this appointment");
    }
    const reviewData = {
        appointmentId: appointmentData.id,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        rating: payload.rating,
        comment: payload.comment,
    };
    if (!reviewData) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield tx.review.create({
            data: reviewData,
        });
        const averageRating = yield tx.review.aggregate({
            _avg: {
                rating: true,
            },
        });
        yield tx.doctor.update({
            where: {
                id: appointmentData.doctorId,
            },
            data: {
                averageRating: averageRating._avg.rating,
            },
        });
        return result;
    }));
});
const getAllReview = (user, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    if (!doctorData) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Doctor not found");
    }
    const result = yield prisma_1.prisma.review.findMany({
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
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield prisma_1.prisma.review.count({});
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.ReviewServices = {
    createIntoDB,
    getAllReview,
};

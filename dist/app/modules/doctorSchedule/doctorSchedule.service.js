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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorScheduleServices = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const createIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const doctorSchedules = payload.scheduleIds.map((scheduleId) => ({
        doctorId: doctorData.id,
        scheduleId,
    }));
    const result = yield prisma_1.prisma.doctorSchedule.createMany({
        data: doctorSchedules,
    });
    return result;
});
const getMySchedule = (filters, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { startDate, endDate } = filters, filteredData = __rest(filters, ["startDate", "endDate"]);
    const andConditions = [];
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
        if (typeof filteredData.isBooked === "string" &&
            filteredData.isBooked === "true") {
            filteredData.isBooked = true;
        }
        else if (typeof filteredData.isBooked === "string" &&
            filteredData.isBooked === "false") {
            filteredData.isBooked = false;
        }
        andConditions.push({
            AND: Object.keys(filteredData).map((field) => ({
                [field]: {
                    equals: filteredData[field],
                },
            })),
        });
    }
    const whereConditions = {
        AND: andConditions,
    };
    const result = yield prisma_1.prisma.doctorSchedule.findMany({
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
    const total = yield prisma_1.prisma.doctorSchedule.count({
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
});
const deleteFromDB = (user, scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
    });
    const isBookedSchedule = yield prisma_1.prisma.doctorSchedule.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId,
            isBooked: true,
        },
    });
    if (isBookedSchedule) {
        throw new ApiError_1.default(400, "This schedule is already booked");
    }
    const result = yield prisma_1.prisma.doctorSchedule.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId,
            },
        },
    });
    return result;
});
const getAllFromDB = (filters, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { startDate, endDate } = filters, filteredData = __rest(filters, ["startDate", "endDate"]);
    const andConditions = [];
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
                    equals: filteredData[field],
                },
            })),
        });
    }
    const whereConditions = {
        AND: andConditions,
    };
    const doctorSchedules = yield prisma_1.prisma.doctorSchedule.findMany({
        where: {
            doctor: {
                email: user.email,
            },
        },
    });
    const doctorSchedulesIds = doctorSchedules.map((schedule) => schedule.scheduleId);
    const result = yield prisma_1.prisma.schedule.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { id: {
                notIn: doctorSchedulesIds,
            } }),
        skip: skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield prisma_1.prisma.schedule.count({
        where: Object.assign(Object.assign({}, whereConditions), { id: {
                notIn: doctorSchedulesIds,
            } }),
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.doctorScheduleServices = {
    createIntoDB,
    getMySchedule,
    deleteFromDB,
    getAllFromDB,
};

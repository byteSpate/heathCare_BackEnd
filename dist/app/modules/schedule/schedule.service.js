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
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleServices = void 0;
const date_fns_1 = require("date-fns");
const prisma_1 = require("../../../shared/prisma");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, startTime, endTime } = payload;
    console.log(startDate, startTime);
    const intervalTime = 30;
    const schedule = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    while (currentDate <= lastDate) {
        const startDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, "yyyy-MM-dd")}`, Number(startTime.split(":")[0])), Number(startTime.split(":")[1])));
        const endDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, "yyyy-MM-dd")}`, Number(endTime.split(":")[0])), Number(endTime.split(":")[1])));
        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime: startDateTime,
                endDateTime: (0, date_fns_1.addMinutes)(startDateTime, intervalTime),
            };
            const existingSchedule = yield prisma_1.prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime,
                },
            });
            if (!existingSchedule) {
                const result = yield prisma_1.prisma.schedule.create({
                    data: scheduleData,
                });
                schedule.push(result);
            }
            startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedule;
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
    console.log(doctorSchedulesIds);
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
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.schedule.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.schedule.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.scheduleServices = {
    createIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB
};

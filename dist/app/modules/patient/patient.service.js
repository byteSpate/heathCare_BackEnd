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
exports.patientServices = void 0;
const prisma_1 = require("../../../generated/prisma");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_2 = require("../../../shared/prisma");
const patient_constant_1 = require("./patient.constant");
const getAllFromDB = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = query, filteredData = __rest(query, ["searchTerm"]);
    const andConditions = [];
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        andConditions.push({
            OR: patient_constant_1.patientSearchAbleFields.map((field) => ({
                [field]: {
                    contains: query === null || query === void 0 ? void 0 : query.searchTerm,
                    mode: "insensitive",
                },
            })),
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
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = {
        AND: andConditions,
    };
    const result = yield prisma_2.prisma.patient.findMany({
        where: whereConditions,
        skip: skip,
        take: limit,
        include: {
            patientHealthData: true,
            medicalReport: true,
        },
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield prisma_2.prisma.patient.count({
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
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_2.prisma.patient.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_2.prisma.patient.findUnique({
        where: {
            id,
        },
        include: {
            medicalReport: true,
            patientHealthData: true,
        },
    });
    return result;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientHealthData, medicalReport } = payload, patientData = __rest(payload, ["patientHealthData", "medicalReport"]);
    const patientInfo = yield prisma_2.prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    yield prisma_2.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.patient.update({
            where: {
                id,
            },
            data: patientData,
        });
        console.log(patientHealthData);
        //create or update patientHealthData
        if (patientHealthData) {
            yield tx.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id,
                },
                update: patientHealthData,
                create: Object.assign(Object.assign({}, patientHealthData), { patientId: patientInfo.id }),
            });
        }
        if (medicalReport) {
            yield tx.medicalReport.create({
                data: Object.assign(Object.assign({}, medicalReport), { patientId: patientInfo.id }),
            });
        }
    }));
    const result = yield prisma_2.prisma.patient.findUnique({
        where: {
            id: id,
        },
        include: {
            medicalReport: true,
            patientHealthData: true,
        },
    });
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield prisma_2.prisma.patient.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_2.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //delete medical report
        yield tx.medicalReport.deleteMany({
            where: {
                patientId: id,
            },
        });
        // if (patient.patientHealthData)
        //   // delete patient health data
        //   await tx.patientHealthData.delete({
        //     where: {
        //       patientId: id,
        //     },
        //   });
        const patientDeleteData = yield tx.patient.delete({
            where: {
                id,
            },
        });
        yield tx.user.delete({
            where: {
                email: patientDeleteData === null || patientDeleteData === void 0 ? void 0 : patientDeleteData.email,
            },
        });
        return patientDeleteData;
    }));
    return result;
});
const softDeleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_2.prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = yield prisma_2.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatePatient = yield tx.patient.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        const updateUser = yield tx.user.update({
            where: {
                email: updatePatient.email,
            },
            data: {
                status: prisma_1.UserStatus.DELETED,
            },
        });
        return updateUser;
    }));
    return result;
});
exports.patientServices = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB,
};

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
exports.doctorService = void 0;
const prisma_1 = require("../../../generated/prisma");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_2 = require("../../../shared/prisma");
const doctor_constant_1 = require("./doctor.constant");
const getAllFromDB = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, specialties } = query, filteredData = __rest(query, ["searchTerm", "specialties"]);
    const andConditions = [];
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        andConditions.push({
            OR: doctor_constant_1.doctorSearchAbleFields.map((field) => ({
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
    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: "insensitive",
                        },
                    },
                },
            },
        });
    }
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = {
        AND: andConditions,
    };
    const result = yield prisma_2.prisma.doctor.findMany({
        where: whereConditions,
        skip: skip,
        take: limit,
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true,
                },
            },
        },
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield prisma_2.prisma.doctor.count({
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
    yield prisma_2.prisma.doctor.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_2.prisma.doctor.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_2.prisma.doctor.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_2.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const doctorDeleteData = yield tx.doctor.delete({
            where: {
                id,
            },
        });
        yield tx.user.delete({
            where: {
                email: doctorDeleteData.email,
            },
        });
        return doctorDeleteData;
    }));
    return result;
});
const softDeleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_2.prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = yield prisma_2.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updateDoctor = yield tx.doctor.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        const updateUser = yield tx.user.update({
            where: {
                email: updateDoctor.email,
            },
            data: {
                status: prisma_1.UserStatus.DELETED,
            },
        });
        return updateUser;
    }));
    return result;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { specialties = [] } = payload, doctorInfo = __rest(payload, ["specialties"]);
    yield prisma_2.prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    yield prisma_2.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.doctor.update({
            where: {
                id,
            },
            data: doctorInfo,
        });
        if (specialties && specialties.length > 0) {
            const deleteSpecialty = specialties.filter((specialty) => specialty.isDeleted);
            for (const specialty of deleteSpecialty) {
                yield tx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: id,
                        specialtiesId: specialty.specialtiesId,
                    },
                });
            }
            //create specialties
            const createSpecialties = specialties.filter((specialty) => !specialty.isDeleted);
            for (const specialty of createSpecialties) {
                yield tx.doctorSpecialties.create({
                    data: {
                        doctorId: id,
                        specialtiesId: specialty.specialtiesId,
                    },
                });
            }
        }
    }));
    const result = yield prisma_2.prisma.doctor.findUnique({
        where: {
            id: id,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true,
                },
            },
        },
    });
    return result;
});
exports.doctorService = {
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB,
    softDeleteFromDB,
    updateIntoDB,
};

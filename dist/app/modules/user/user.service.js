"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.userServices = void 0;
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = require("../../../generated/prisma");
const prisma_2 = require("../../../shared/prisma");
const fileUploader_1 = require("../../../helpers/fileUploader");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_constant_1 = require("./user.constant");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, 10);
    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: prisma_1.UserRole.ADMIN,
    };
    const adminData = req.body.admin;
    const result = yield prisma_2.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.user.create({
            data: userData,
        });
        const admin = yield tx.admin.create({
            data: adminData,
        });
        return admin;
    }));
    return {
        result,
        message: "Admin created successfully",
        status: 200,
        success: true,
    };
});
const createDoctor = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, 10);
    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: prisma_1.UserRole.DOCTOR,
    };
    const doctorData = req.body.doctor;
    const result = yield prisma_2.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.user.create({
            data: userData,
        });
        const doctor = yield tx.doctor.create({
            data: doctorData,
        });
        return doctor;
    }));
    return {
        result,
        message: "Doctor created successfully",
        status: 200,
        success: true,
    };
});
const createPatient = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, 10);
    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: prisma_1.UserRole.PATIENT,
    };
    const patientData = req.body.patient;
    const result = yield prisma_2.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.user.create({
            data: userData,
        });
        const patient = yield tx.patient.create({
            data: patientData,
        });
        return patient;
    }));
    return {
        result,
        message: "Patient created successfully",
        status: 200,
        success: true,
    };
});
const getAllFromDB = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = query, filteredData = __rest(query, ["searchTerm"]);
    const andConditions = [];
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchAbleFields.map((field) => ({
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
    const whereConditions = {
        AND: andConditions,
    };
    const result = yield prisma_2.prisma.user.findMany({
        where: whereConditions,
        skip: skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
        select: {
            id: true,
            email: true,
            password: false,
            role: true,
            needsPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            doctor: true,
            patient: true,
        },
    });
    const total = yield prisma_2.prisma.user.count({
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
const changeStatus = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_2.prisma.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const updateStatusResult = yield prisma_2.prisma.user.update({
        where: {
            email: isUserExist.email,
        },
        data: {
            status: req.body.status,
        },
    });
    return updateStatusResult;
});
const getMe = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_2.prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
        select: {
            id: true,
            email: true,
            role: true,
            needsPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    let profileInfo;
    if (userInfo.role == "SUPER_ADMIN" || userInfo.role == "ADMIN") {
        profileInfo = yield prisma_2.prisma.admin.findUniqueOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    else if (userInfo.role == "DOCTOR") {
        profileInfo = yield prisma_2.prisma.doctor.findUniqueOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    else if (userInfo.role == "PATIENT") {
        profileInfo = yield prisma_2.prisma.patient.findUniqueOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const updateMyProfile = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(user);
    const userInfo = yield prisma_2.prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: prisma_1.UserStatus.ACTIVE,
        },
    });
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    let profileInfo;
    if (userInfo.role == "SUPER_ADMIN" || userInfo.role == "ADMIN") {
        profileInfo = yield prisma_2.prisma.admin.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    else if (userInfo.role == "DOCTOR") {
        profileInfo = yield prisma_2.prisma.doctor.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    else if (userInfo.role == "PATIENT") {
        profileInfo = yield prisma_2.prisma.patient.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    return Object.assign({}, profileInfo);
});
exports.userServices = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeStatus,
    getMe,
    updateMyProfile,
};

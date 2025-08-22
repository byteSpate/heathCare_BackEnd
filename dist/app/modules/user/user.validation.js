"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidations = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../../generated/prisma");
const createAdmin = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required",
    }),
    admin: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }),
        email: zod_1.z.string({ required_error: "Email is required" }),
        contactNumber: zod_1.z.string({ required_error: "Contact number is required" }),
    }),
});
const createDoctor = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required",
    }),
    doctor: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }),
        email: zod_1.z.string({ required_error: "Email is required" }),
        contactNumber: zod_1.z.string({ required_error: "Contact number is required" }),
        address: zod_1.z.string().optional(),
        registrationNumber: zod_1.z.string({
            required_error: "Registration Number is required",
        }),
        experience: zod_1.z.number().default(0),
        gender: zod_1.z.enum([prisma_1.Gender.FEMALE, prisma_1.Gender.MALE], {
            required_error: "Gender is required",
        }),
        appointmentFee: zod_1.z.number({ required_error: "Appointment Fee is required" }),
        qualification: zod_1.z.string({ required_error: "Qualification is required" }),
        currentWorkingPlace: zod_1.z.string({
            required_error: "CurrentWorking place is required",
        }),
        designation: zod_1.z.string({
            required_error: "Designation is required",
        }),
        averageRating: zod_1.z.number().optional(),
    }),
});
const createPatient = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required",
    }),
    patient: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }),
        email: zod_1.z.string({ required_error: "Email is required" }),
        contactNumber: zod_1.z.string({ required_error: "Contact number is required" }),
        address: zod_1.z.string().optional(),
    }),
});
const changeStatus = zod_1.z.object({
    status: zod_1.z.enum([prisma_1.UserStatus.ACTIVE, prisma_1.UserStatus.BLOCKED, prisma_1.UserStatus.DELETED]),
});
exports.userValidations = {
    createAdmin,
    createDoctor,
    createPatient,
    changeStatus,
};

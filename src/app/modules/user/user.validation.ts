import { z } from "zod";
import { Gender, UserStatus } from "../../../generated/prisma";

const createAdmin = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  admin: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string({ required_error: "Email is required" }),
    contactNumber: z.string({ required_error: "Contact number is required" }),
  }),
});

const createDoctor = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  doctor: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string({ required_error: "Email is required" }),
    contactNumber: z.string({ required_error: "Contact number is required" }),
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: "Registration Number is required",
    }),
    experience: z.number().default(0),
    gender: z.enum([Gender.FEMALE, Gender.MALE], {
      required_error: "Gender is required",
    }),
    appointmentFee: z.number({ required_error: "Appointment Fee is required" }),
    qualification: z.string({ required_error: "Qualification is required" }),
    currentWorkingPlace: z.string({
      required_error: "CurrentWorking place is required",
    }),
    designation: z.string({
      required_error: "Designation is required",
    }),
    averageRating: z.number().optional(),
  }),
});

const createPatient = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  patient: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string({ required_error: "Email is required" }),
    contactNumber: z.string({ required_error: "Contact number is required" }),
    address: z.string().optional(),
  }),
});

const changeStatus = z.object({
  status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
});

export const userValidations = {
  createAdmin,
  createDoctor,
  createPatient,
  changeStatus,
};

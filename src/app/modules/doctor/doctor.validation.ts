import { z } from "zod";
import { Gender } from "../../../generated/prisma";

export const updateDoctor = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  registrationNumber: z.string().optional(),
  experience: z.number().optional(),
  gender: z.enum([Gender.FEMALE, Gender.MALE]).optional(),
  appointmentFee: z.number().optional(),
  qualification: z.string().optional(),
  currentWorkingPlace: z.string().optional(),
  designation: z.string().optional(),
  averageRating: z.number().optional(),
});

export const doctorValidation = {
  updateDoctor,
};

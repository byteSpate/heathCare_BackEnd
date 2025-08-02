import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDB = async (req: Request) => {
  console.log(req.body);
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url as string;
  }
  req.body.title = req.body.title;

  const result = await prisma.specialties.create({
    data: {
      title: req.body.title,
      icon: req.body.icon,
    },
  });

  if (!result) {
    throw new Error("Failed to create specialty");
  }

  return result;
};

const getAllFromDB = async () => {
  const result = await prisma.specialties.findMany({});
  return result;
};

const deleteById = async (id: string) => {
  await prisma.specialties.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const specialtiesServices = {
  insertIntoDB,
  getAllFromDB,
  deleteById,
};

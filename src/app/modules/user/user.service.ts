import * as bcrypt from "bcrypt";
import { UserRole } from "../../../generated/prisma";
import { prisma } from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";

const createAdminAtDb = async (req: any) => {
  const file = req.file;
  console.log(file);
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    console.log(uploadToCloudinary);

    req.body.data.admin.profilePhoto = uploadToCloudinary?.secure_url as string;

    console.log(req.body);

    // console.log(uploadToCloudinary);

    // console.log(uploadToCloudinary);
  }
  // const hashedPassword = await bcrypt.hash(data.password, 10);
  // const userData = {
  //   email: data.admin.email,
  //   password: hashedPassword,
  //   role: UserRole.ADMIN,
  // };
  // const adminData = data.admin;

  // const result = await prisma.$transaction(async (tx) => {
  //   await tx.user.create({
  //     data: userData,
  //   });
  //   const admin = await tx.admin.create({
  //     data: adminData,
  //   });
  //   return admin;
  // });

  // return {
  //   result,
  //   message: "Admin created successfully",
  //   status: 200,
  //   success: true,
  // };
};

export const userServices = {
  createAdminAtDb,
};

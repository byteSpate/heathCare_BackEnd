import ApiError from "../src/app/errors/ApiError";
import { UserRole } from "../src/generated/prisma";
import { prisma } from "../src/shared/prisma";
import * as bcrypt from "bcrypt";

const seedAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isSuperAdminExist) {
      throw new Error("Super Admin Is Exist");
      return;
    }

    const hashedPassword = await bcrypt.hash("superadmin", 10);

    const superAdminData = await prisma.user.create({
      data: {
        email: "super@admin.com",
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Abdullah Al Noman",
            contactNumber: "01884444559",
          },
        },
      },
    });

    console.log("Super Admin Created Successfully", superAdminData);
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};


seedAdmin()

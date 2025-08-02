import { UserRole } from "../../generated/prisma";

export type IAuthUser = {
  role: UserRole;
  email: string;
};

import { compare } from "bcrypt";
import { User } from "@prisma/client";

export const matchPasswords = async (password: string, user: User) => {
  return await compare(password, user.password);
};

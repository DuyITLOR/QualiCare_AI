import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface LoginResult {
  token: string;
  userId: string;
}

interface RegisterResult {
  token: string;
  user: {
    userId: string;
  };
}

export const signin = async (
  email: string,
  password: string,
): Promise<LoginResult> => {
  const user = await prisma.accounts.findUnique({ where: { email } });

  if (!user) {
    throw new Error("The account does not exist");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Incorrect password");
  }

  const token = jwt.sign(
    { userId: user.userId.toString(), email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );

  return {
    token,
    userId: user.userId.toString(),
  };
};

export const signup = async (
  email: string,
  password: string,
  phoneNumber: string,
  name: string,
  date: string,
): Promise<RegisterResult> => {
  const existing = await prisma.accounts.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
  });

  if (existing) {
    throw new Error("The account already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Parse date - set to null if invalid
  let parsedDate: Date | null = null;
  if (date) {
    const tempDate = new Date(date);
    if (!isNaN(tempDate.getTime())) {
      parsedDate = tempDate;
    }
  }

  const user = await prisma.accounts.create({
    data: {
      email,
      passwordHash,
      phoneNumber,
      name,
      date: parsedDate,
    },
  });

  const token = jwt.sign(
    { userId: user.userId.toString(), email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );

  return {
    token,
    user: {
      userId: user.userId.toString(),
    },
  };
};

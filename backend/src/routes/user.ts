import { Router } from "express";
import { prisma } from "../lib/prisma";
import { signupSchema } from "../types/signupSchema";
import { updatedUserSchema } from "../types/updatedUserSchema";
import { StatusCode } from "../types/statusCodes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth";
import { PrismaClientUnknownRequestError } from "../generated/prisma/internal/prismaNamespace";
import { FileSystemRouter } from "bun";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(StatusCode.BAD_REQUEST).json({
      message: "Invalid inputs",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });
//   const existingUser  = await prisma.user.findMany();

// console.log(existingUser);

// return res.json(existingUser);

  if (existingUser) {
    return res.status(StatusCode.CONFLICT).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      username,
      password: hashedPassword,
    },
  });
 await prisma.account.create({
  data: {
    userId: user.id,
    balance: 10000
  }
});
  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET!
  );

  return res.status(StatusCode.CREATED).json({
    message: "User created",
    token,
  });
});

userRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  //plan
          // console.log("BODY:", req.body);
          // console.log("USERNAME:", username);
          // console.log("TYPE:", typeof username);
            const user = await prisma.user.findUnique({
              where: {
                username,
              },
            });

  if (!user) {
    return res.status(StatusCode.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }

  const check = await bcrypt.compare(password, user.password);

  if (!check) {
    return res.status(StatusCode.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET!
  );

  return res.status(StatusCode.OK).json({
    message: "Signed in",
    token,
  });
});

userRouter.put("/update", auth, async (req, res) => {
  const userId = (req as any).userId;

  const result = updatedUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(StatusCode.BAD_REQUEST).json({
      message: "Invalid inputs",
    });
  }

  const { firstName, lastName, username, password } = req.body;
  let hashedPassword;

    if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
    }
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      firstName,
      lastName,
      username,
      password : hashedPassword ?? undefined
    },
  });

  return res.status(StatusCode.OK).json({
    message: "Profile updated",
  });
});

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter as string;

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          firstName: {
            contains: filter,
            mode:"insensitive"
          }
        },
        {
          lastName: {
            contains: filter,
            mode:"insensitive"
          }
        }
      ]
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true
    }
  });

  return res.json({
    users
  });
});
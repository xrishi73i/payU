import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { StatusCode } from "../types/statusCodes";

export async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1]!;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload & {
      userId: string;
    };

    (req as any).userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(StatusCode.BAD_REQUEST).json({
      message: "Invalid token",
    });
  }
}
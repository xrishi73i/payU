import { Router } from "express";
import { prisma } from "../lib/prisma";
import { auth } from "../middleware/auth";
import { StatusCode } from "../types/statusCodes";
import { from } from "node:stream/iter";

export const accountRouter = Router();

accountRouter.get("/balance", auth, async (req, res) => {
  const userId = (req as any).userId;

  const account = await prisma.account.findUnique({
    where: {
      userId
    }
  });

  if (!account) {
    return res.status(StatusCode.NOT_FOUND).json({
      message: "Account not found"
    });
  }

  return res.status(StatusCode.OK).json({
    balance: account.balance
  });
});



accountRouter.post("/transfer", auth, async (req, res) => {
  try {
    const fromUserId = (req as any).userId;
    const { toUserId, amount } = req.body;

    if (!toUserId || !amount || amount <= 0) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: "Invalid inputs"
      });
    }

    if (fromUserId === toUserId) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: "You cannot transfer money to yourself"
      });
    }

    const sender = await prisma.account.findUnique({
      where: {
        userId: fromUserId
      }
    });

    const receiver = await prisma.account.findUnique({
      where: {
        userId: toUserId
      }
    });

    if (!sender || !receiver) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: "Account not found"
      });
    }

    if (sender.balance < amount) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: "Insufficient balance"
      });
    }

    const transaction = await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: {
          userId: fromUserId
        },
        data: {
          balance: {
            decrement: amount
          }
        }
      });

      await tx.account.update({
        where: {
          userId: toUserId
        },
        data: {
          balance: {
            increment: amount
          }
        }
      });

      return await tx.transaction.create({
        data: {
          fromUserId,
          toUserId,
          amount
        }
      });
    });

    return res.status(StatusCode.OK).json({
      message: "Transfer successful",
      transactionId: transaction.id
    });

  } catch (error) {
    console.error(error);

    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error"
    });
  }
});
accountRouter.get("/transactions", auth, async (req, res) => {
  try {
    const currentUserId = (req as any).userId;

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            fromUserId: currentUserId,
          },
          {
            toUserId: currentUserId,
          },
        ],
      },
      include: {
        fromUser: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        toUser: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(StatusCode.OK).json({
      transactions,
    });
  } catch (error) {
    console.error("Transaction History Error:", error);

    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
});

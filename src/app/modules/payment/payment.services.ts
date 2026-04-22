import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { PaymentStatus } from "../../../generated/prisma/enums";

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  try {
    const isPaymentExists = await prisma.payment.findUnique({
      where: {
        stripeEventId: event.id,
      },
    });
    if (isPaymentExists) {
      throw new AppError(status.BAD_REQUEST, "Payment already processed");
    }
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;

        const paymentId = session.metadata?.paymentId;

        if (!paymentId) {
          throw new AppError(status.BAD_REQUEST, "Missing metadata");
        }

        if (session.payment_status !== "paid") {
          throw new AppError(status.BAD_REQUEST, "Payment not completed");
        }

        await prisma.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            paymentData: session,
            transactionId: session.payment_intent?.transaction_id,
            status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.FAILED,
          },
        });

        console.log(`🔓 Payment success: ${paymentId}`);

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        const paymentId = session.metadata?.paymentId;

        if (paymentId) {
          await prisma.payment.update({
            where: { id: paymentId },
            data: {
              status: PaymentStatus.FAILED,
              paymentData: {
                stripeSessionId: session.id,
                expired: true,
              },
            },
          });
        }

        break;
      }

      default: {
        console.log(`Unhandled event: ${event.type}`);
        return { message: "Ignored event" };
      }
    }
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return { message: "Webhook failed" };
  }
};

const getMyTransactions = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const total = await prisma.payment.count({
    where: {
      userId,
    },
  });
  const totalPages = Math.ceil(total / limit);

  const transactions = await prisma.payment.findMany({
    where: {
      userId,
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  return { transactions, totalPages };
};

const getAllTransactions = async (page: number, limit: number) => {
  const total = await prisma.payment.count();
  const totalPages = Math.ceil(total / limit);

  const transactions = await prisma.payment.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  return { transactions, totalPages };
};

export const paymentServices = {
  handlerStripeWebhookEvent,
  getMyTransactions,
  getAllTransactions,
};

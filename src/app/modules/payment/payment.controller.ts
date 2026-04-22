import { Request, Response } from "express";
import status from "http-status";
import { paymentServices } from "./payment.services";
import { envConfig } from "../../config/env";
import { stripe } from "../../config/stripe.config";

import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";
import { IRequestUser } from "../../interfaces/user.interface";

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = envConfig.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      return res
        .status(status.BAD_REQUEST)
        .json({ message: "Missing Stripe signature or webhook secret" });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (error: any) {
      console.error("Error processing Stripe webhook:", error);
      return res
        .status(status.BAD_REQUEST)
        .json({ message: "Error processing Stripe webhook" });
    }

    try {
      const result = await paymentServices.handlerStripeWebhookEvent(event);

      sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Stripe webhook event processed successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error handling Stripe webhook event:", error);
      sendResponse(res, {
        statusCode: status.INTERNAL_SERVER_ERROR,
        success: false,
        data: error,
        message: "Error handling Stripe webhook event",
      });
    }
  },
);

const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await paymentServices.getMyTransactions(
    user.userId,
    page,
    limit,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "My transactions retrieved successfully",
    data: result.transactions,
    meta: {
      page,
      limit,
      totalPages: result.totalPages,
    },
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await paymentServices.getAllTransactions(page, limit);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All transactions retrieved successfully",
    data: result.transactions,
    meta: {
      page,
      limit,
      totalPages: result.totalPages,
    },
  });
});

export const paymentController = {
  handleStripeWebhookEvent,
  getMyTransactions,
  getAllTransactions,
};

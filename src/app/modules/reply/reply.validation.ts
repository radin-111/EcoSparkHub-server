import z from "zod";

export const replySchema = z.object({
  content: z.string().min(1, "Reply is required"),
  commentId: z.string().min(1, "Comment ID is required"),
});
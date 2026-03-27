import z from "zod";

import { IdeaStatus } from "../../../generated/prisma/enums";

export const ideaStatusChangeSchema = z.object({
  status: z.enum([IdeaStatus.APPROVED, IdeaStatus.REJECTED]),
});

export const ideaCreateSchema = z.object({
  name: z.string().min(5, "Name is required."),
  description: z.string("Description is required."),
  categoryId: z.string("Category ID is required."),
});
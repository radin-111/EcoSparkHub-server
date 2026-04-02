import z from "zod";

import { IdeaStatus } from "../../../generated/prisma/enums";

export const ideaStatusChangeSchema = z.object({
  status: z.enum([IdeaStatus.APPROVED, IdeaStatus.REJECTED]),
});

export const ideaCreateSchema = z.object({
  name: z.string().min(5, "Name is required."),
  description: z.string("Description is required."),
  status: z.enum([IdeaStatus.DRAFT]).optional(),
  categoryId: z.string("Category ID is required."),
});

export const ideaUpdateSchema = z
  .object({
    name: z.string().min(5, "Name is required."),
    description: z.string("Description is required."),
   
    imageUrl: z.string().optional(),
    categoryId: z.string("Category ID is required."),
  })
  .partial();

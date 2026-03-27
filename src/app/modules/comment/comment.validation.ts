import z from "zod";


export const commentSchema = z.object({
  content: z.string("Comment content is required"),
  ideaId: z.string("Idea ID is required"),
});


export const updateCommentSchema = z.object({
  
  content: z.string("Comment content is required"),
});
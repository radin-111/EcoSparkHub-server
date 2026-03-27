import z from "zod";
import { ideaCreateSchema } from "./idea.validation";

export interface IRequestIdeaCreate extends z.infer<typeof ideaCreateSchema> {
  imageUrl: string;
}
 
import z from "zod";
import { prisma } from "../../lib/prisma";
import {
  categoryUpdateValidationSchema,
  categoryValidationSchema,
} from "./category.validation";

const createCategory = async (
  payload: z.infer<typeof categoryValidationSchema>,
) => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};
const updateCategory = async (
  id: string,
  payload: z.infer<typeof categoryUpdateValidationSchema>,
) => {
  const isExist = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new Error("Category not found");
  }

  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};
const deleteCategory = async (id: string) => {
  const isExist = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new Error("Category not found");
  }

  const result = await prisma.category.delete({
    where: {
      id,
    },
  });
  return result;
};

export const categoryServices = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};

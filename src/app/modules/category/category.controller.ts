import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { categoryServices } from "./category.services";

const createCategory= catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Category created successfully",
    data: result,
  });
});
const getAllCategories= catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Categories retrieved successfully",
    data: result,
  });
});
const updateCategory= catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.updateCategory(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Category updated successfully",
    data: result,
  });
});
const deleteCategory= catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.deleteCategory(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Category deleted successfully",
    data: result,
  });
});

export const categoryControllers={  
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
}

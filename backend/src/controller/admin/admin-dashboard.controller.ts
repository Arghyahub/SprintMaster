import { Request, Response } from "express";
import Api from "../../util/api";
import prisma from "../../db/prisma";

async function fetchAllData(req: Request, res: Response): Promise<void> {
  try {
    const userCount = await prisma.user.count();

    const data = {
      userCount,
    };

    return Api.response({
      res,
      status: 200,
      payload: data,
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return Api.response({
      res,
      status: 500,
      message: "Internal Server Error",
      error: error.message || "An unexpected error occurred",
    });
  }
}

const adminDashboardController = {
  fetchAllData,
};

export default adminDashboardController;

import { Request, Response } from "express";
import Api from "../../util/api";
import prisma from "../../db/prisma";
import Util from "../../util/utils";

const getCompanyDetails = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const company = await prisma.company.findFirst({
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
    });

    if (!company) {
      return Api.response({
        res,
        status: 404,
        message: "Company not found for the user.",
        error: "No company associated with the user.",
      });
    }

    return Api.response({
      res,
      status: 200,
      message: "Company details fetched successfully.",
      payload: company,
    });
  } catch (error) {
    console.log("Error in getCompanyDetails:", error);
    return Api.response({
      res,
      status: 500,
      message: "Internal server error while fetching company details.",
      error: error?.message || "Internal server error.",
    });
  }
};

const createOrUpdateCompany = async (req: Request, res: Response) => {
  try {
    const { name, company_size, about } = req.body || {};
    const user = await prisma.user.findFirst({
      where: { id: req.user.id },
    });

    if (!user?.company_id) {
      await prisma.company.create({
        data: {
          name,
          company_size,
          about,
          users: {
            connect: { id: user.id },
          },
        },
      });
    } else {
      await prisma.company.update({
        where: { id: user.company_id },
        data: {
          name,
          company_size,
          about,
        },
      });
    }

    return Api.response({
      res,
      status: 200,
      message: `Company ${
        user?.company_id ? "updated" : "created"
      } successfully.`,
    });
  } catch (error) {
    console.log("Error in createOrUpdateCompany:", error);
    return Api.response({
      res,
      status: 500,
      message: "Internal server error while creating/updating company.",
      error: error?.message || "Internal server error.",
    });
  }
};

const companyController = {
  getCompanyDetails,
  createOrUpdateCompany,
};

export default companyController;

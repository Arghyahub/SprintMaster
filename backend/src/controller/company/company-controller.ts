import { Request, Response } from "express";
import Api from "../../util/api";
import prisma from "../../db/prisma";
import Util from "../../util/utils";
import Cryptr from "../../util/cryptr";

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

const getDashboardData = async (req: Request, res: Response) => {
  try {
    const company = await prisma.company.findFirst({
      where: {
        users: {
          some: {
            id: req.user.id,
          },
        },
      },
    });

    if (!Util.isNotNull(company?.id)) {
      if (req.user.user_type == "super_admin") {
        return Api.response({
          res,
          status: 200,
          message: "Admin check pass.",
        });
      }
      return Api.response({
        res,
        status: 400,
        message: "User is not associated with any company.",
        error: "No company associated with the user.",
      });
    }

    const board = await prisma.board.groupBy({
      by: ["status"],
      _count: true,
      where: {
        company_id: company?.id,
      },
    });

    const users = await prisma.user.count({
      where: {
        company_id: company?.id,
      },
    });

    // const pending_tasks = await prisma.$queryRaw`
    //   select * from "Board" b
    //   join "Task" t on b.id = t.board_id
    //   where b.status = 'in_progress' and
    //   b.company_id = ${company?.id} and
    //   t.stage_idx < (select array_length(b.stages, 1) - 1)
    // `;

    return Api.response({
      res,
      status: 200,
      message: "Dashboard data fetched",
      payload: {
        board_management: board,
        user_management: users,
        pending_tasks: null,
      },
    });
  } catch (error) {
    console.log(error);
    return Api.response({
      res,
      status: 500,
      message: "Internal Server Error",
      error: error?.message ?? "Internal Server Error",
    });
  }
};

const getPeopleList = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        company_id: true,
      },
    });

    const companyPeople = await prisma.user.findMany({
      where: {
        company_id: user.company_id,
        // id: {
        //   not: user.id
        // }
      },
      select: {
        id: true,
        name: true,
        email: true,
        user_type: true,
      },
    });

    return Api.response({
      res,
      status: 200,
      message: "User data fetched successfully",
      payload: companyPeople,
    });
  } catch (error) {
    console.log(error);
    return Api.response({
      res,
      status: 500,
      message: "Internal server error",
    });
  }
};

const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.accessRole.findMany({
      where: {
        is_master: true,
        for_type: {
          notIn: ["admin", "super_admin"],
        },
      },
      select: {
        name: true,
        id: true,
      },
    });

    return Api.response({
      res,
      status: 200,
      message: "Access Roles fetched successfully",
      payload: roles,
    });
  } catch (error) {
    console.log(error);
    return Api.response({
      res,
      message: "Internal server error",
      status: 500,
      error: error?.message,
    });
  }
};

const getCompanyUser = async (req: Request, res: Response) => {
  const { id } = req.params || {};
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        company_id: true,
      },
    });

    const companyUser = await prisma.user.findFirst({
      where: {
        id: Number(id),
        company_id: user.company_id,
      },
    });

    if (!companyUser)
      return Api.response({
        res,
        status: 400,
        message: "User not found",
      });

    companyUser.password = "";

    return Api.response({
      res,
      status: 200,
      message: "Data fetched succesfully",
      payload: companyUser,
    });
  } catch (error) {
    console.log(error);
    return Api.response({
      res,
      message: "Internal server error",
      status: 500,
      error: error?.message,
    });
  }
};

const createOrUpdateCompanyUser = async (req: Request, res: Response) => {
  try {
    const { id, name, email, role_id, user_type } = req.body || {};
    const nullValues = Util.nullValues({ name, email, role_id });

    if (nullValues.length > 0) {
      return Api.response({
        res,
        status: 400,
        message: `Missing required fields ${Util.formatKeys(nullValues)}`,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        company_id: true,
      },
    });

    if (Util.isNotNull(id)) {
      await prisma.user.update({
        where: {
          id: id,
          company_id: user.company_id,
        },
        data: {
          name: name,
          email: email,
          access_role_id: role_id,
          user_type: user_type,
        },
      });
    } else {
      const { password } = req.body || {};
      if (!Util.isNotNull(password))
        return Api.response({
          res,
          message: "missing required field password",
          status: 400,
        });

      const existingUser = await prisma.user.findFirst({
        where: {
          email: {
            equals: email.trim(),
            mode: "insensitive",
          },
        },
      });

      if (existingUser) {
        return Api.response({
          res,
          status: 400,
          message: "A user with this email already exists",
        });
      }

      const hash = await Cryptr.hashPassword(password);
      await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hash,
          access_role_id: role_id,
          user_type: user_type,
          company_id: user.company_id,
        },
      });
    }

    return Api.response({
      res,
      status: 200,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    return Api.response({
      res,
      status: 500,
      message: "Internal server error",
    });
  }
};

const companyController = {
  getCompanyDetails,
  createOrUpdateCompany,
  getDashboardData,
  getPeopleList,
  getRoles,
  getCompanyUser,
  createOrUpdateCompanyUser,
};

export default companyController;

import { Request, Response } from "express";
import prisma from "../../db/prisma";
import Api from "../../util/api";
import Util from "../../util/utils";
import TableUtil from "../../util/table";

async function getAllRoles(req: Request, res: Response) {
  try {
    let { take, skip, ANDCondition, order } = TableUtil.getTableFilters(req);
    if (!order) order = { created_at: "asc" };

    const id = req.query?.id ? Number(req.query.id) : undefined;

    if (id) {
      take = 1;
      skip = 0;
      ANDCondition = undefined;
    }

    const roles = await prisma.accessRole.findMany({
      where: {
        id: id,
        AND: ANDCondition,
      },
      include: {
        updated_by_user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: order,
      take,
      skip,
    });

    return Api.response({
      res,
      status: 200,
      message: "Roles fetched successfully",
      payload: roles,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return Api.response({
      res,
      status: 500,
      message: "Internal Server Error",
      error: error.message || "An unexpected error occurred",
    });
  }
}

async function rolesAddUpdate(req: Request, res: Response) {
  try {
    const { id, name, is_master = false, role } = req.body || {};
    const userId = req?.user?.id;

    const nullKeys = Util.nullValues({ name, role });

    if (nullKeys.length > 0) {
      return Api.response({
        res,
        status: 400,
        message: `Missing required fields: ${Util.formatKeys(nullKeys)}`,
        error: `Missing fields: ${nullKeys.join(", ")}`,
      });
    }

    let message = "Role added successfully";

    if (id) {
      await prisma.accessRole.update({
        where: { id: id },
        data: {
          name: name.trim(),
          // is_master: is_master,
          // for_type: for_type,
          role: role,
          updated_by_id: userId,
        },
      });
      message = "Role updated successfully";
    } else {
      const { for_type } = req.body || {};
      if (Util.isNotNull(for_type) == false) {
        return Api.response({
          res,
          status: 400,
          message: "for_type is required",
        });
      }

      await prisma.accessRole.create({
        data: {
          name: name.trim(),
          is_master: is_master,
          for_type: for_type,
          role: role,
          created_at: new Date(),
          updated_by_id: userId,
        },
      });
    }

    return Api.response({
      res,
      status: 200,
      message: message,
    });
  } catch (error) {
    console.log(error);
    return Api.response({
      res,
      message: "Internal Server Error",
      status: 500,
      error: error.message,
    });
  }
}

const adminRoleController = {
  getAllRoles,
  rolesAddUpdate,
};
export default adminRoleController;

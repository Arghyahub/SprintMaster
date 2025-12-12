import { Request, Response } from "express";
import Api from "../../util/api";
import prisma from "../../db/prisma";

type dashboardRoleType = {
  access: boolean;
  board_management: boolean;
  user_management: boolean;
  task_management: boolean;
  contribution: boolean;
};

async function getDashboardData(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        company_id: true,
        access_role: true,
      },
    });
    const role = user.access_role?.role;

    console.log(role);

    if (!role?.["0"]) {
      return Api.response({
        res,
        status: 404,
        message: "role not found",
      });
    }

    if (req.user.user_type == "super_admin") req.user.id = undefined;

    const dashboardRole: dashboardRoleType = role?.["0"];

    let board_management, user_management, task_management, contribution;

    if (dashboardRole.user_management) {
      user_management = await prisma.user.groupBy({
        by: ["user_type"],
        _count: true,
        where: {
          company_id: user.company_id ?? undefined,
        },
      });

      console.log(user_management);
    }

    if (dashboardRole.board_management) {
      const boards = await prisma.$queryRaw`
    SELECT 
      b.name,
      b.id,
      COUNT(t.id) FILTER (WHERE bs.is_final = false)::integer AS pending_tasks,
      COUNT(t.id)::integer AS total_tasks,
      COUNT(t.id) FILTER (WHERE bs.is_final = true)::integer AS completed_tasks
    FROM "Board" b
    LEFT JOIN "BoardStage" bs ON b.id = bs.board_id
    LEFT JOIN "Task" t ON bs.id = t.stage_id
    INNER JOIN "RelationUserBoard" rub ON b.id = rub.board_id
    WHERE rub.user_id = ${req.user.id}
    GROUP BY b.id, b.name
    ORDER BY b.created_at DESC
    `;

      board_management = boards;
    }

    if (dashboardRole.task_management) {
      const [doneTask, pendingTask] = await prisma.$transaction([
        prisma.task.count({
          where: {
            board_stage: {
              board: {
                relationUserBoards: {
                  some: {
                    user_id: req.user.id,
                  },
                },
              },
              is_final: true,
            },
            assigned_to_id: req.user.id,
          },
        }),
        prisma.task.count({
          where: {
            board_stage: {
              board: {
                relationUserBoards: {
                  some: {
                    user_id: req.user.id,
                  },
                },
              },
              is_final: false,
            },
            assigned_to_id: req.user.id,
          },
        }),
      ]);
      task_management = {
        doneTask,
        pendingTask,
      };
    }

    if (dashboardRole.contribution) {
    }

    return Api.response({
      res,
      status: 200,
      message: "success",
      payload: {
        board_management,
        user_management,
        task_management,
        contribution,
      },
    });
  } catch (error) {
    console.log(error);
    return Api.response({
      res,
      status: 500,
      message: "internal server error",
      error: error,
    });
  }
}

const commonController = {
  getDashboardData,
};

export default commonController;

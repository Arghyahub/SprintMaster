import { Request, Response } from "express";
import prisma from "../../db/prisma";
import Api from "../../util/api";
import Util from "../../util/utils";

const getBoardSummary = async (req: Request, res: Response) => {
  try {
    const boards = await prisma.$queryRaw`
    SELECT 
      b.name,
      b.id,
      COUNT(t.id) FILTER (WHERE bs.is_final = false)::numeric AS pending_tasks,
      COUNT(t.id)::numeric AS total_tasks,
      COUNT(t.id) FILTER (WHERE bs.is_final = true)::numeric AS completed_tasks
    FROM "Board" b
    LEFT JOIN "BoardStage" bs ON b.id = bs.board_id
    LEFT JOIN "Task" t ON bs.id = t.stage_id
    INNER JOIN "RelationUserBoard" rub ON b.id = rub.board_id
    WHERE rub.user_id = ${req.user.id}
    GROUP BY b.id, b.name
    `;

    return Api.response({
      res,
      status: 200,
      message: "Boards fetched successfully.",
      payload: boards,
    });
    // return res.status(200).json({ payload: board });
  } catch (error) {
    console.error("Error fetching board:", error);
    return Api.response({
      res,
      status: 500,
      message: "Internal server error.",
    });
  }
};

const createUpdateBoard = async (req: Request, res: Response) => {
  try {
    const { id, name, start_date, end_date, status, user_ids } = req.body;
    const { stages } = req.body as {
      stages: { label: string; is_final: boolean }[];
    };

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const nullValues = Util.nullValues({
      name,
      start_date,
      end_date,
      status,
      stages,
      company: user.company_id,
      user_ids,
    });

    if (nullValues.length > 0) {
      return Api.response({
        res,
        status: 400,
        message: `Missing required fields: ${Util.formatKeys(nullValues)}`,
      });
    }

    if (user_ids.length == 0)
      return Api.response({
        res,
        status: 400,
        message: "Atleast one user needs to be selected for a sprint.",
      });

    if (Util.isNotNull(id)) {
      await prisma.relationUserBoard.deleteMany({
        where: {
          board_id: Number(id),
        },
      });

      await prisma.board.update({
        where: { id: Number(id) },
        data: {
          name,
          start_date,
          end_date,
          status,
          company_id: user.company_id,
          boardStages: {
            createMany: {
              data: stages.map((stage, index) => ({
                name: stage.label,
                is_final: stage.is_final,
                order: index,
              })),
            },
          },
          relationUserBoards: {
            createMany: {
              data: user_ids.map((usr) => ({
                user_id: usr,
              })),
            },
          },
        },
      });
    } else {
      await prisma.board.create({
        data: {
          name,
          start_date,
          end_date,
          status,
          company_id: user.company_id,
          boardStages: {
            createMany: {
              data: stages.map((stage, index) => ({
                name: stage.label,
                is_final: stage.is_final,
                order: index,
              })),
            },
          },
          relationUserBoards: {
            createMany: {
              data: user_ids.map((usr) => ({
                user_id: usr,
              })),
            },
          },
        },
      });

      return Api.response({
        res,
        status: 201,
        message: "Board created successfully.",
      });
    }
  } catch (error) {
    console.error("Error creating/updating board:", error);
    return Api.response({
      res,
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

const getBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Util.isNotNull(id)) {
      return Api.response({
        res,
        status: 400,
        message: "Board ID not required.",
      });
    }

    const board = await prisma.board.findUnique({
      where: {
        id: Number(id),
        relationUserBoards: {
          some: { user_id: req.user.id },
        },
      },
      include: {
        boardStages: {
          include: {
            tasks: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        relationUserBoards: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return Api.response({
        res,
        status: 404,
        message: "Board not found.",
      });
    }

    return Api.response({
      res,
      status: 200,
      message: "Board fetched successfully.",
      payload: board,
    });
  } catch (error) {
    console.error("Error fetching board:", error);
    return Api.response({
      res,
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

const createUpdateTask = async (req: Request, res: Response) => {
  try {
    const { name, description, boardId, id } = req.body || {};

    const nullValues = Util.nullValues({ name, boardId });
    if (nullValues.length > 0) {
      return Api.response({
        res,
        status: 400,
        message: `Missing fields ${Util.formatKeys(nullValues)}`,
      });
    }

    if (Util.isNotNull(id)) {
    } else {
      const stage = await prisma.boardStage.findFirst({
        where: {
          is_final: false,
          board_id: Number(boardId),
        },
        orderBy: {
          order: "asc",
        },
      });

      if (!stage)
        return Api.response({
          res,
          status: 500,
          message: "No final stage found, a board should have one final stage",
        });

      const totalTasks = await prisma.task.count({
        where: {
          stage_id: stage.id,
        },
      });

      const task = await prisma.task.create({
        data: {
          name: name,
          description: description ?? "",
          created_by_id: req.user.id,
          board_id: Number(boardId),
          stage_id: stage.id,
          order: totalTasks,
        },
        select: {
          id: true,
        },
      });

      const board = await prisma.board.findUnique({
        where: {
          id: Number(boardId),
          relationUserBoards: {
            some: { user_id: req.user.id },
          },
        },
        include: {
          boardStages: {
            include: {
              tasks: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      return Api.response({
        res,
        status: 200,
        message: "Task created successfully",
        payload: board,
      });
    }
  } catch (error) {
    console.log("error ", error);
    return Api.response({
      res,
      message: "Internal server error",
      error: error?.message ?? "",
      status: 500,
    });
  }
};

const moveTask = async (req: Request, res: Response) => {
  try {
    const { taskId, stageId, index } = req.body || {};
    const nullValues = Util.nullValues({ taskId, index });
    if (nullValues.length > 0) {
      return Api.response({
        res,
        success: false,
        status: 400,
        message: `Missing required fields ${Util.formatKeys(nullValues)}`,
      });
    }

    await prisma.task.updateMany({
      where: { stage_id: stageId, order: { gte: index } },
      data: {
        order: {
          increment: 1,
        },
      },
    });

    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        stage_id: stageId,
        order: index,
      },
    });

    return Api.response({
      res,
      status: 200,
      message: "Board order updated successfully",
    });
  } catch (error) {
    console.log(error);
    return Api.response({
      res,
      status: 500,
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const boardController = {
  getBoardSummary,
  createUpdateBoard,
  getBoard,
  createUpdateTask,
  moveTask,
};

export default boardController;

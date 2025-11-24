import { Request, Response } from "express";
import prisma from "../../db/prisma";
import Api from "../../util/api";
import Util from "../../util/utils";

const getBoard = async (req: Request, res: Response) => {
  try {
    const boards = await prisma.$queryRaw`
    SELECT 
      b.name,
      COUNT(t.id) FILTER (WHERE bs.is_final = false)::numeric AS pending_tasks,
      COUNT(t.id)::numeric AS total_tasks,
      COUNT(t.id) FILTER (WHERE bs.is_final = true)::numeric AS completed_tasks
    FROM "Board" b
    LEFT JOIN "BoardStage" bs ON b.id = bs.board_id
    LEFT JOIN "Task" t ON bs.id = t.stage_id
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
    const { id, name, start_date, end_date, status } = req.body;
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
    });

    if (nullValues.length > 0) {
      return Api.response({
        res,
        status: 400,
        message: `Missing required fields: ${Util.formatKeys(nullValues)}`,
      });
    }

    if (Util.isNotNull(id)) {
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

const boardController = {
  getBoard,
  createUpdateBoard,
};

export default boardController;

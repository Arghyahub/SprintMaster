import { Request, Response } from "express";
import prisma from "../../db/prisma";
import Api from "../../util/api";

const getBoard = async (req: Request, res: Response) => {
  try {
    const boards = await prisma.$queryRaw`
    SELECT 
      b.*,
      COUNT(t.id) FILTER (WHERE bs.is_final = false) AS pending_tasks,
      COUNT(t.id) AS total_tasks
    FROM "Board" b
    LEFT JOIN "BoardStage" bs ON b.id = bs.board_id
    LEFT JOIN "Task" t ON bs.id = t.stage_id
    GROUP BY b.id;
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

const boardController = {
  getBoard,
};

export default boardController;

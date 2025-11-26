import { Router } from "express";
import boardController from "../../controller/board/board.controller";

const boardRouter = Router();

boardRouter.get("/", boardController.getBoardSummary);
boardRouter.post("/create-update", boardController.createUpdateBoard);
boardRouter.get("/{:id}", boardController.getBoard);
boardRouter.post("/task/create-update", boardController.createUpdateTask);

export default boardRouter;

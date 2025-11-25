import { Router } from "express";
import boardController from "../../controller/board/board.controller";

const boardRouter = Router();

boardRouter.get("/", boardController.getBoardSummary);
boardRouter.post("/create-update", boardController.createUpdateBoard);
boardRouter.get("/{:id}", boardController.getBoard);

export default boardRouter;

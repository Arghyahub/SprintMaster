import { Router } from "express";
import boardController from "../../controller/board/board.controller";

const boardRouter = Router();

boardRouter.get("/", boardController.getBoard);
boardRouter.post("/create-update", boardController.createUpdateBoard);

export default boardRouter;

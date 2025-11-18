import { Router } from "express";
import boardController from "../../controller/board/board.controller";

const boardRouter = Router();

boardRouter.get("/", boardController.getBoard);

export default boardRouter;

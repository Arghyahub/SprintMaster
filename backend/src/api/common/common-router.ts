import { Router } from "express";
import commonController from "../../controller/common/common.controller";

const commonRouter = Router();

commonRouter.get("/dashboard", commonController.getDashboardData);

export default commonRouter;

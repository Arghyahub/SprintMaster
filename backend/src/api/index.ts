import { Router } from "express";
import publicRouter from "./public/public.route";
import authRouter from "./auth/auth.route";
import authMiddleware from "../middleware/auth-middleware";
import adminRouter from "./admin/admin.route";
import companyRouter from "./company/company-route";
import boardRouter from "./board/board-router";
import commonRouter from "./common/common-router";

const apiRouter = Router();

apiRouter.use("/public", publicRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/admin", authMiddleware, adminRouter);
apiRouter.use("/company", authMiddleware, companyRouter);
apiRouter.use("/board", authMiddleware, boardRouter);
apiRouter.use("/common", authMiddleware, commonRouter);

export default apiRouter;

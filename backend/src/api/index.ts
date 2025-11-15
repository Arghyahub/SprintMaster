import { Router } from "express";
import publicRouter from "./public/public.route";
import authRouter from "./auth/auth.route";
import authMiddleware from "../middleware/auth-middleware";
import adminRouter from "./admin/admin.route";
import companyRouter from "./company/company-route";

const apiRouter = Router();

apiRouter.use("/public", publicRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/admin", authMiddleware, adminRouter);
apiRouter.use("/company", authMiddleware, companyRouter);

export default apiRouter;

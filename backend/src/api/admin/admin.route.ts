import { Router } from "express";
import authMiddleware from "../../middleware/auth-middleware";
import adminRoleController from "../../controller/admin/admin-role.controller";
import adminDashboardController from "../../controller/admin/admin-dashboard.controller";
import roleMiddlewareGenerator from "../../middleware/role-middleware-generator";

const adminRouter = Router();

const adminMiddleware = roleMiddlewareGenerator(["super_admin"]);

adminRouter.get("/role", adminMiddleware, adminRoleController.getAllRoles);
adminRouter.post(
  "/role/add-update",
  adminMiddleware,
  adminRoleController.rolesAddUpdate
);

export default adminRouter;

import { Router } from "express";
import roleMiddlewareGenerator from "../../middleware/role-middleware-generator";
import companyController from "../../controller/company/company-controller";

const companyRouter = Router();
// Access middlewares
const managerOnly = roleMiddlewareGenerator(["manager"]);
//

companyRouter.get("/", companyController.getCompanyDetails);

companyRouter.post(
  "/add-update",
  managerOnly,
  companyController.createOrUpdateCompany
);

companyRouter.get("/dashboard", companyController.getDashboardData);
companyRouter.get("/people", companyController.getPeopleList);
companyRouter.get("/roles", companyController.getRoles);
companyRouter.get("/people/{:id}", companyController.getCompanyUser);
companyRouter.post(
  "/people/update",
  companyController.createOrUpdateCompanyUser
);

export default companyRouter;

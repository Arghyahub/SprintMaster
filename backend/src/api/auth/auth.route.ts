import { Router } from "express";
import AuthController from "../../controller/auth/auth.controller";

// login/signup routes defined in public
const authRouter = Router();

authRouter.post("/signup", AuthController.signUp);
authRouter.post("/login", AuthController.login);
authRouter.get("/refresh{/:fullData}", AuthController.refresh);
authRouter.get("/logout", AuthController.logout);

export default authRouter;

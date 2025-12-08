import { NextFunction, Request, Response } from "express";
import Api from "../util/api";
import { UserTypeEnum } from "@prisma/client";

function roleMiddlewareGenerator(roleList: UserTypeEnum[]) {
  const roleCheckMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user || !req.user.user_type) {
      return Api.response({
        res,
        status: 404,
        message: "Forbidden",
        error: "User role not found",
      });
    }

    // Check if the user has the required role
    const userRole = req.user.user_type as UserTypeEnum;
    const hasRequiredRole = roleList.includes(userRole);

    if (!hasRequiredRole) {
      return Api.response({
        res,
        status: 404,
        message: "Forbidden",
        error: "User does not have the required role",
      });
    }

    next();
  };

  return roleCheckMiddleware;
}

export default roleMiddlewareGenerator;

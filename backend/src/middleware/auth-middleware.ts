import { NextFunction, Request, Response } from "express";
import Api from "../util/api";
import Cryptr from "../util/cryptr";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if the request has an authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return Api.response({
      res,
      status: 401,
      message: "Unauthorized",
    });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }

  // console.log("Token:", token);

  try {
    const decoded = Cryptr.verifyToken(token, "access");
    // console.log("decoded",decoded)
    req.user = { id: decoded.userId, user_type: decoded.user_type };
    next();
  } catch (error) {
    return Api.response({
      res,
      status: 403,
      message: "Token Expired",
      error: error,
    });
  }
};

export default authMiddleware;

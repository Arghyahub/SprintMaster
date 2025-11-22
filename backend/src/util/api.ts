import { Response } from "express";

interface ApiResponse {
  res: Response;
  status: number;
  message: string;
  error?: string;
  payload?: Record<any, any>;
}

class Api {
  static response({
    res,
    status = 200,
    message,
    error,
    payload,
  }: ApiResponse): void {
    res.status(status).json({
      message,
      error,
      payload,
    });
  }
}

export default Api;

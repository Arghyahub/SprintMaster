import { Response } from "express";

interface ApiResponse {
  res: Response;
  success?: boolean;
  status: number;
  message: string;
  error?: string;
  payload?: Record<any, any>;
}

class Api {
  static response({
    res,
    status = 200,
    success = false,
    message,
    error,
    payload,
  }: ApiResponse): void {
    res.status(status).json({
      success,
      message,
      error,
      payload,
    });
  }
}

export default Api;

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
    success,
    message,
    error,
    payload,
  }: ApiResponse): void {
    res.status(status).json({
      success: success ? success : status >= 200 && status < 400,
      message,
      error,
      payload,
    });
  }
}

export default Api;

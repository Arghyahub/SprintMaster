"use client";
import axios from "axios";

class Api {
  static instance: Api = null;

  static axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
    withCredentials: true,
  });

  static accessToken = "";

  static isRefreshing = false;
  static failedQueue = [];

  static setAccessToken(token: string) {
    this.accessToken = token;
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  static processQueue(error?: Error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    this.failedQueue = [];
  }

  static initInterceptor() {
    this.axiosInstance.interceptors.response.use(
      // on fulfilled
      (response) => {
        if (response.status == 401) {
          Api.setAccessToken("");
          window.location.href = "/auth/login";
          return response;
        }
        return response;
      },
      // on Error
      async (error) => {
        console.log("Error: ");
        // Save the orignal request, url, header etc
        const originalRequest = error.config;

        // If forbidden
        if (error.response?.status === 403 && !originalRequest._retry) {
          // Mark that we have already retrying so that we don't retry unlimited times
          originalRequest._retry = true;

          // Out of all the requests, only the first makes the refresh api call
          if (!this.isRefreshing) {
            console.log("refreshing");
            // Mark that we have already made the refresh api call
            this.isRefreshing = true;
            try {
              console.log("Refreshing access token...");
              const res = await this.axiosInstance.get("/auth/refresh");
              if (res.status == 200 && res.data?.payload?.accessToken) {
                const accessToken = res.data?.payload?.accessToken;
                this.setAccessToken(accessToken);
                this.processQueue(null, accessToken);
              } else {
                throw new Error("Failed to refresh token");
              }
            } catch (err) {
              this.processQueue(err, null);
              window.location.href = "/login";
              return Promise.reject(err);
            } finally {
              this.isRefreshing = false;
            }
          }

          return new Promise((resolve, reject) => {
            this.failedQueue.push({
              resolve: (token) => {
                originalRequest.headers["Authorization"] = "Bearer " + token;
                resolve(this.axiosInstance(originalRequest));
              },
              reject: (err) => reject(err),
            });
          });
        }

        return Promise.reject(error);
      }
    );
  }

  static async get(url: string, query = {}, config = {}) {
    let params = {};
    const queryKeys = Object.keys(query);
    if (queryKeys.length > 0) {
      for (const key of queryKeys) {
        params[key] = JSON.stringify(query[key]);
      }
    }

    return Api.axiosInstance.get(url, {
      params,
      validateStatus: (status) => status !== 403,
      ...config,
    });
  }

  static async post(url: string, data = {}, config = {}) {
    return Api.axiosInstance.post(url, data, {
      validateStatus: (status) => status !== 403,
      ...config,
    });
  }
}

// Initialize interceptor once
Api.initInterceptor();

export default Api;

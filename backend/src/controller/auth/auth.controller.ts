import { Request, Response } from "express";
import Util from "../../util/utils";
import Api from "../../util/api";
import prisma from "../../db/prisma";
import Cryptr from "../../util/cryptr";

async function signUp(req: Request, res: Response) {
  const { name, email, password } = req.body || {};
  const nullKeys = Util.nullValues({ name, email, password });

  if (nullKeys.length > 0) {
    return Api.response({
      res,
      status: 400,
      message: `Missing required fields: ${Util.formatKeys(nullKeys)}`,
      error: `Missing fields: ${nullKeys.join(", ")}`,
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email?.trim(),
          mode: "insensitive",
        },
      },
    });

    if (user) {
      return Api.response({
        res,
        status: 400,
        message: "User already exists, please try logging in or reset password",
      });
    }

    const hashedPasswd = await Cryptr.hashPassword(password);

    const ownerAccessRole = await prisma.accessRole.findFirst({
      where: {
        for_type: "employee",
        is_master: true,
      },
      orderBy: {
        created_at: "asc",
      },
      select: {
        id: true,
      },
    });

    if (!ownerAccessRole) {
      return Api.response({
        res,
        status: 400,
        message: "Access Role not initialized, please select a different role",
        error: "This access role is not initialized in the DB",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPasswd,
        user_type: "employee",
        access_role_id: ownerAccessRole.id,
      },
    });

    const accessToken = Cryptr.generateAccessToken(
      newUser.id,
      newUser.user_type
    );
    const refreshToken = Cryptr.generateRefreshToken(
      newUser.id,
      newUser.user_type
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !Util.isDevEnv(),
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return Api.response({
      res,
      status: 200,
      message: "Signed up successfully",
      payload: {
        accessToken,
      },
    });
  } catch (error) {
    return Api.response({
      res,
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body || {};
  const nullKeys = Util.nullValues({ email, password });

  if (nullKeys.length > 0) {
    return Api.response({
      res,
      status: 400,
      message: `Missing required fields: ${Util.formatKeys(nullKeys)}`,
      error: `Missing fields: ${nullKeys.join(", ")}`,
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email?.trim(),
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return Api.response({
        res,
        status: 400,
        message: "User not found, please sign up",
      });
    }

    const isPasswordValid = await Cryptr.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return Api.response({
        res,
        status: 400,
        message: "Invalid credentials",
      });
    }

    const accessToken = Cryptr.generateAccessToken(user.id, user.user_type);
    const refreshToken = Cryptr.generateRefreshToken(user.id, user.user_type);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !Util.isDevEnv(),
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return Api.response({
      res,
      status: 200,
      message: "Logged in successfully",
      payload: {
        accessToken,
      },
    });
  } catch (error) {
    console.log("Error during login:", error);
    return Api.response({
      res,
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
}

async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  // console.log("Refresh token:", refreshToken);
  const isFullData = req.params.fullData === "full-data";
  if (!refreshToken) {
    return Api.response({
      res,
      status: 401,
      message: "Unauthorized, please log in again",
      error: "No refresh token provided",
    });
  }

  let userId: number | undefined;
  try {
    userId = Cryptr.verifyToken(refreshToken, "refresh")?.userId;
    if (!Util.isNotNull(userId)) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: !Util.isDevEnv(),
        sameSite: "lax",
        path: "/api/auth",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      throw new Error("Invalid token");
    }
  } catch (error) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: !Util.isDevEnv(),
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return Api.response({
      res,
      status: 401,
      message: "Invalid refresh token, please log in again",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      user_type: true,
    },
  });

  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: !Util.isDevEnv(),
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    return Api.response({
      res,
      status: 404,
      message: "User not found",
      error: "No user found with the provided ID",
    });
  }

  try {
    const accessToken = Cryptr.generateAccessToken(userId, user.user_type);

    if (isFullData) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          access_role: true,
        },
      });
      user.password = undefined;
      if (!user) {
        return Api.response({
          res,
          status: 404,
          message: "User not found",
          error: "No user found with the provided ID",
        });
      }
      return Api.response({
        res,
        status: 200,
        message: "Token refreshed successfully",
        payload: {
          accessToken,
          user,
        },
      });
    }

    // res.cookie("refreshToken", newRefreshToken, {
    //   httpOnly: true,
    //   secure: !Util.isDevEnv(),
    //   sameSite: "lax",
    //   path: "/api/auth",
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // });

    return Api.response({
      res,
      status: 200,
      message: "Authenticated successfully",
      payload: {
        accessToken,
      },
    });
  } catch (error) {
    console.log("Refresh auth\n", error);
    return Api.response({
      res,
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
}

async function logout(req: Request, res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: !Util.isDevEnv(),
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  return Api.response({
    res,
    status: 200,
    message: "Logged out successfully",
  });
}

const AuthController = {
  signUp: signUp,
  login: login,
  refresh: refresh,
  logout: logout,
};
export default AuthController;

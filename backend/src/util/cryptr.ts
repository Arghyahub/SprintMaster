import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import Env from "../config/env";
import { UserTypeEnum } from "@prisma/client";

class Cryptr {
  static async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hashSync(password, salt);
    } catch (error) {
      throw new Error(
        JSON.stringify({ message: "Error hashing password", error })
      );
    }
  }

  static comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  static generateAccessToken(
    userId: number,
    user_type: UserTypeEnum,
    expiresIn: SignOptions["expiresIn"] = "30m"
  ) {
    return jwt.sign({ userId, user_type }, Env.ACCESS_SECRET, { expiresIn });
  }

  static generateRefreshToken(
    userId: number,
    user_type: UserTypeEnum,
    expiresIn: SignOptions["expiresIn"] = "30d"
  ) {
    return jwt.sign({ userId, user_type }, Env.REFRESH_SECRET, { expiresIn });
  }

  static verifyToken(token: string, secret: "access" | "refresh") {
    try {
      const secretKey =
        secret === "access" ? Env.ACCESS_SECRET : Env.REFRESH_SECRET;
      return jwt.verify(token, secretKey) as {
        userId: number;
        user_type: UserTypeEnum;
      };
    } catch (error) {
      throw new Error(
        JSON.stringify({ message: "Error verifying token", error })
      );
    }
  }
}

export default Cryptr;

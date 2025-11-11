import { hashSync } from "bcrypt";
import Env from "../config/env";

// Core utils only
class Util {
  static isNotNull(data: any, allowEmpty = false) {
    if (allowEmpty) {
      return data !== null && data !== undefined;
    } else {
      return data !== null && data !== undefined && data !== "";
    }
  }

  static nullValues(data: Record<any, any>, allowEmpty: boolean = false) {
    const result: string[] = [];
    for (const key of Object.keys(data)) {
      const isValid = this.isNotNull(data[key], allowEmpty);
      if (!isValid) {
        result.push(key);
      }
    }
    return result;
  }

  static prettifyKey(key: string): string {
    let result = key?.replaceAll("_", " ")?.trim() ?? "";
    let copy = result?.[0]?.toUpperCase() ?? result[0] ?? "";
    for (let i = 1; i < result.length; i++) {
      if (
        i != 1 &&
        result[i] != " " &&
        result[i - 1] >= "a" &&
        result[i - 1] <= "z" &&
        result[i] >= "A" &&
        result[i] <= "Z"
      ) {
        copy += " " + result[i];
      } else if (result[i - 1] == " ")
        copy += result[i].toUpperCase() ?? result[i] ?? "";
      else copy += result[i];
    }

    return copy;
  }

  static formatKeys(data: string[]): string {
    return (data.map((key) => this.prettifyKey(key)) ?? [])?.join(", ");
  }

  static hashPassword(password: string): string {
    const saltRounds = 10;
    return hashSync(password, saltRounds);
  }

  static isDevEnv(): boolean {
    return ["future", "staging", "development"].includes(Env.DEV_ENV);
  }

  static buildNestedObjectFromString(
    str: string,
    value?: any
  ): Record<any, any> {
    const keys = str.split(".");
    let obj = {};
    let ref = obj;

    keys.forEach((key, idx) => {
      if (idx == keys.length - 1 && this.isNotNull(value)) ref[key] = value;
      else ref[key] = {};
      ref = ref[key];
    });

    if (value) ref = value;

    return obj;
  }
}

export default Util;

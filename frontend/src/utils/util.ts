import useGlobalStore from "@/store/global-store";
import { redirect } from "next/navigation";
import Api from "./api";

class Util {
  static isOnServer() {
    return typeof window === "undefined";
  }

  static logout() {
    if (Util.isOnServer()) {
      return;
    }
    useGlobalStore.getState().clearAccessToken();
    Api.setAccessToken("");
    Api.get("/auth/logout");
    redirect("/auth/login");
  }

  static isNotNull(data: any, allowEmpty = false) {
    if (allowEmpty) {
      return data !== null && data !== undefined;
    } else {
      return data !== null && data !== undefined && data !== "";
    }
  }

  static nullValues(data: Record<any, any>, allowEmpty = false) {
    const result: string[] = [];
    for (const key in Object.keys(data)) {
      const isValid = this.isNotNull(data[key], allowEmpty);
      if (!isValid) {
        result.push(key);
      }
    }
    return result;
  }
}

export default Util;

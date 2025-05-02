import { MAIN_API } from "@/lib/api/endpoints/index.ts";

export const loginAPI = (payload: any) => MAIN_API.post("/auth/login", payload);
export const registerAPI = (payload: any) =>
  MAIN_API.post("/auth/register", payload);

export const logoutAPI = () => MAIN_API.post("/logout");

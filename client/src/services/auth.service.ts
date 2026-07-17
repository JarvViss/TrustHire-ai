import { api } from "./api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "recruiter";
}

export interface LoginData {
  email: string;
  password: string;
}

export const registerUser = (data: RegisterData) =>
  api.post("/auth/register", data);

export const loginUser = (data: LoginData) =>
  api.post("/auth/login", data);

export const getProfile = () =>
  api.get("/auth/profile");
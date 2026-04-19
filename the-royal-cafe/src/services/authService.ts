// src/services/authService.ts

import { postRequest } from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

/* ================= TYPES ================= */
export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  password: string;
  gender: string;
};

type AuthResponse = {
  token: string;
  user: unknown;
  message: string;
};

/* ================= LOGIN ================= */
export const loginService = async (
  data: LoginPayload,
): Promise<AuthResponse> => {
  const res = await postRequest(ENDPOINTS.AUTH.LOGIN, data);

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return {
    token: responseData.token,
    user: responseData.user,
    message,
  };
};

/* ================= REGISTER ================= */
export const registerService = async (
  data: RegisterPayload,
): Promise<AuthResponse> => {
  const res = await postRequest(ENDPOINTS.AUTH.REGISTER, data);

  // backend uses "data" instead of "responseData"
  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return {
    token: responseData.token,
    user: responseData.user,
    message,
  };
};

export const logoutService = async (): Promise<string | null> => {
  try {
    const res = await postRequest(ENDPOINTS.AUTH.LOGOUT);

    const { success, message } = res.data;

    if (!success) throw new Error(message);

    return message;
  } catch (err: unknown) {
    console.error("Logout API failed", err);
    return null;
  }
};

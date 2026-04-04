import { loginApi } from "../api/auth.api";
import { AxiosError } from "axios";

export const loginService = async (data: {
  username: string;
  password: string;
}) => {
  try {
    const res = await loginApi(data);

    const { success, message, responseData } = res.data;

    if (!success) {
      throw new Error(message || "Login failed");
    }

    return {
      token: responseData.token,
      user: responseData.user,
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
    throw new Error("Login failed");
  }
};

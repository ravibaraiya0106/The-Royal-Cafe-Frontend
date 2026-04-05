import { postRequest } from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

export const loginService = async (data: {
  username: string;
  password: string;
}) => {
  const res = await postRequest(ENDPOINTS.AUTH.LOGIN, data);

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return {
    token: responseData.token,
    user: responseData.user,
    message,
  };
};

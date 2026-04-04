import API from "./axios";
import { ENDPOINTS } from "./endpoints";

export const loginApi = async (data: unknown) => {
  const res = await API.post(ENDPOINTS.AUTH.LOGIN, data);
  return res;
};

export const registerApi = async (data: unknown) => {
  const res = await API.post(ENDPOINTS.AUTH.REGISTER, data);
  return res;
};

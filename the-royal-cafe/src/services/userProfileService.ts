import { getRequest, putRequest } from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

/* ================= GET BY ID ================= */
export const getUserProfileById = async (id: string) => {
  const res = await getRequest(ENDPOINTS.USER_PROFILE.GET_BY_ID(id));

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= UPDATE ================= */
export const updateUserProfile = async (id: string, formData: FormData) => {
  const res = await putRequest(ENDPOINTS.USER_PROFILE.UPDATE(id), formData, true);

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

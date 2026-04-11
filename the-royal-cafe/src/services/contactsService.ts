import { deleteRequest, getRequest } from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

/* ================= GET ALL ================= */
export const contactsList = async (params?: Record<string, unknown>) => {
  const res = await getRequest(ENDPOINTS.CONTACTS.GET_ALL, params);

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= GET BY ID ================= */
export const getContactById = async (id: string) => {
  const res = await getRequest(ENDPOINTS.CONTACTS.GET_BY_ID(id));

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= DELETE ================= */
export const deleteContact = async (id: string) => {
  const res = await deleteRequest(ENDPOINTS.CONTACTS.DELETE(id));

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

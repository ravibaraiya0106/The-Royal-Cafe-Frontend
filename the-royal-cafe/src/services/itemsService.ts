import { getRequest, postRequest, putRequest } from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

/* ================= GET ALL ================= */
export const itemsList = async () => {
  const res = await getRequest(ENDPOINTS.ITEMS.GET_ALL);

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= CREATE ================= */
export const createItem = async (formData: FormData) => {
  const res = await postRequest(ENDPOINTS.ITEMS.CREATE, formData);

  const { success, message } = res.data;

  if (!success) throw new Error(message);

  return message;
};

/* ================= UPDATE ================= */
export const updateItem = async (id: string, formData: FormData) => {
  const res = await putRequest(ENDPOINTS.ITEMS.UPDATE(id), formData);

  const { success, message } = res.data;

  if (!success) throw new Error(message);

  return message;
};

/* ================= DELETE ================= */
export const deleteItem = async (id: string) => {
  const res = await getRequest(ENDPOINTS.ITEMS.DELETE(id));

  const { success, message } = res.data;

  if (!success) throw new Error(message);

  return message;
};

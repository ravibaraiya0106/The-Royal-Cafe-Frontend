import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

/* ================= GET ALL ================= */
export const itemsList = async () => {
  const res = await getRequest(ENDPOINTS.ITEMS.GET_ALL);

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= GET BY ID ================= */
export const getItemById = async (id: string) => {
  const res = await getRequest(ENDPOINTS.ITEMS.GET_BY_ID(id));

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= CREATE ================= */
export const createItem = async (formData: FormData) => {
  const res = await postRequest(ENDPOINTS.ITEMS.CREATE, formData, true);

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

/* ================= UPDATE ================= */
export const updateItem = async (id: string, formData: FormData) => {
  const res = await putRequest(ENDPOINTS.ITEMS.UPDATE(id), formData, true);

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

/* ================= DELETE ================= */
export const deleteItem = async (id: string) => {
  const res = await deleteRequest(ENDPOINTS.ITEMS.DELETE(id));

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

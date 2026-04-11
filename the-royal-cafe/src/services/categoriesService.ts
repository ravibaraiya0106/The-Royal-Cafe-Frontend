import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

/* ================= GET ALL ================= */
export const categoriesList = async (params?: Record<string, unknown>) => {
  const res = await getRequest(ENDPOINTS.CATEGORIES.GET_ALL, params);

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= GET BY ID ================= */
export const getCategoryById = async (id: string) => {
  const res = await getRequest(ENDPOINTS.CATEGORIES.GET_BY_ID(id));

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= CREATE ================= */
export const createCategory = async (formData: FormData) => {
  const res = await postRequest(ENDPOINTS.CATEGORIES.CREATE, formData, true);

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

/* ================= UPDATE ================= */
export const updateCategory = async (id: string, formData: FormData) => {
  const res = await putRequest(ENDPOINTS.CATEGORIES.UPDATE(id), formData, true);

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

/* ================= DELETE ================= */
export const deleteCategory = async (id: string) => {
  const res = await deleteRequest(ENDPOINTS.CATEGORIES.DELETE(id));

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

/* ================= GET ALL ================= */
export const blogList = async (params?: Record<string, unknown>) => {
  const res = await getRequest(ENDPOINTS.BLOG.GET_ALL, params);

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= GET BY ID ================= */
export const getBlogById = async (id: string) => {
  const res = await getRequest(ENDPOINTS.BLOG.GET_BY_ID(id));

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= CREATE ================= */
export const createBlog = async (formData: FormData) => {
  const res = await postRequest(ENDPOINTS.BLOG.CREATE, formData, true);

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

/* ================= UPDATE ================= */
export const updateBlog = async (id: string, formData: FormData) => {
  const res = await putRequest(ENDPOINTS.BLOG.UPDATE(id), formData, true);

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

/* ================= DELETE ================= */
export const deleteBlog = async (id: string) => {
  const res = await deleteRequest(ENDPOINTS.BLOG.DELETE(id));

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

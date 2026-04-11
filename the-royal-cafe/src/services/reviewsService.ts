import { deleteRequest, getRequest } from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

/* ================= GET ALL ================= */
export const reviewsList = async (params?: Record<string, unknown>) => {
  const res = await getRequest(ENDPOINTS.REVIEWS.GET_ALL, params);

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= GET BY ID ================= */
export const getReviewById = async (id: string) => {
  const res = await getRequest(ENDPOINTS.REVIEWS.GET_BY_ID(id));

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= DELETE ================= */
export const deleteReview = async (id: string) => {
  const res = await deleteRequest(ENDPOINTS.REVIEWS.DELETE(id));

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

import { deleteRequest, getRequest, postRequest } from "./apiService";
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

/* ================= CREATE (USER) ================= */
export const createReview = async (form: {
  product: string;
  rating: number;
  comment?: string;
}) => {
  const res = await postRequest(ENDPOINTS.REVIEWS.CREATE, {
    product: form.product,
    rating: form.rating,
    comment: form.comment || "",
  });

  const { success, message, data } = res.data as {
    success: boolean;
    message: string;
    data: unknown;
  };

  if (!success) throw new Error(message);
  return data;
};

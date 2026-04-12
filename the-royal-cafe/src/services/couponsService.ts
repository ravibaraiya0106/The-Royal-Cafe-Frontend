import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

/* ================= GET ALL ================= */
export const couponsList = async (params?: Record<string, unknown>) => {
  const res = await getRequest(ENDPOINTS.COUPONS.GET_ALL, params);

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= GET BY ID ================= */
export const getCouponById = async (id: string) => {
  const res = await getRequest(ENDPOINTS.COUPONS.GET_BY_ID(id));

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= CREATE ================= */
export const createCoupon = async (formData: FormData) => {
  const res = await postRequest(ENDPOINTS.COUPONS.CREATE, formData, true);

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

/* ================= UPDATE ================= */
export const updateCoupon = async (id: string, formData: FormData) => {
  const res = await putRequest(ENDPOINTS.COUPONS.UPDATE(id), formData, true);

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

/* ================= DELETE ================= */
export const deleteCoupon = async (id: string) => {
  const res = await deleteRequest(ENDPOINTS.COUPONS.DELETE(id));

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

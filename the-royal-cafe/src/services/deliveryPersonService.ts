import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

/* ================= GET ALL ================= */
export const deliveryPersonList = async (params?: Record<string, unknown>) => {
  const res = await getRequest(ENDPOINTS.DELIVERY_PERSON.GET_ALL, params);

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= GET BY ID ================= */
export const getDeliveryPersonById = async (id: string) => {
  const res = await getRequest(ENDPOINTS.DELIVERY_PERSON.GET_BY_ID(id));

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= CREATE ================= */
export const createDeliveryPerson = async (formData: FormData) => {
  const res = await postRequest(
    ENDPOINTS.DELIVERY_PERSON.CREATE,
    formData,
    true,
  );

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

/* ================= UPDATE ================= */
export const updateDeliveryPerson = async (id: string, formData: FormData) => {
  const res = await putRequest(
    ENDPOINTS.DELIVERY_PERSON.UPDATE(id),
    formData,
    true,
  );

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

/* ================= DELETE ================= */
export const deleteDeliveryPerson = async (id: string) => {
  const res = await deleteRequest(ENDPOINTS.DELIVERY_PERSON.DELETE(id));

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

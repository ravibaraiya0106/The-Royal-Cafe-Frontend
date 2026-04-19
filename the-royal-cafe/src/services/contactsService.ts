import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "./apiService";
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

/* ================= REPLY ================= */
export const replyContact = async (id: string, formData: FormData) => {
  const res = await putRequest(ENDPOINTS.CONTACTS.REPLY(id), formData, true);

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

/* ================= CREATE ================= */
export const createContact = async (formData: FormData) => {
  const res = await postRequest(ENDPOINTS.CONTACTS.CREATE, formData, true);

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

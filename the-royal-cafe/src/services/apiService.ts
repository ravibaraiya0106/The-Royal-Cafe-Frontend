import client from "../api/axios";
import { toFormData } from "../utils/formData";

const isFormData = (data: unknown): data is FormData => {
  return typeof FormData !== "undefined" && data instanceof FormData;
};

/* ================= GET ================= */
export const getRequest = (url: string, params = {}) => {
  return client.get(url, { params });
};

/* ================= POST ================= */
export const postRequest = (url: string, data = {}, isMultipart = false) => {
  const payload = isMultipart
    ? isFormData(data)
      ? data
      : toFormData(data)
    : data;

  return client.post(url, payload);
};

/* ================= PUT ================= */
export const putRequest = (url: string, data = {}, isMultipart = false) => {
  const payload = isMultipart
    ? isFormData(data)
      ? data
      : toFormData(data)
    : data;

  return client.put(url, payload);
};

/* ================= PATCH ================= */
export const patchRequest = (url: string, data = {}, isMultipart = false) => {
  const payload = isMultipart
    ? isFormData(data)
      ? data
      : toFormData(data)
    : data;

  return client.patch(url, payload);
};

/* ================= DELETE ================= */
export const deleteRequest = (url: string) => {
  return client.delete(url);
};

import client from "../api/axios";
import { toFormData } from "../utils/formData";

// GET (no formData needed)
export const getRequest = (url: string, params = {}) => {
  return client.get(url, { params });
};

// POST (always FormData)
export const postRequest = (url: string, data = {}) => {
  return client.post(url, toFormData(data));
};

// PUT
export const putRequest = (url: string, data = {}) => {
  return client.put(url, toFormData(data));
};

// PATCH
export const patchRequest = (url: string, data = {}) => {
  return client.patch(url, toFormData(data));
};

// DELETE
export const deleteRequest = (url: string) => {
  return client.delete(url);
};

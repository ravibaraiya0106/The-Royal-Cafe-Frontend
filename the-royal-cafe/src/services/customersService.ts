import { deleteRequest, getRequest } from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

/* ================= GET ALL ================= */
export const customersList = async (params?: Record<string, unknown>) => {
  const res = await getRequest(ENDPOINTS.CUSTOMERS.GET_ALL, params);

  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);

  return responseData;
};

/* ================= DELETE ================= */
export const deleteCustomer = async (id: string) => {
  const res = await deleteRequest(ENDPOINTS.CUSTOMERS.DELETE(id));

  const { success, message } = res.data;

  if (!success) throw new Error(message);
  return message;
};

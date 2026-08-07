import { getRequest } from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

export const ordersList = async () => {
  const res = await getRequest(ENDPOINTS.ORDER.LIST);
  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);
  return responseData;
};

export const getOrderDetails = async (id: string) => {
  const res = await getRequest(ENDPOINTS.ORDER.DETAILS(id));
  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);
  return responseData;
};

export const adminOrdersList = async (params?: Record<string, unknown>) => {
  const res = await getRequest(ENDPOINTS.ORDER.ADMIN_LIST, params);
  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);
  return responseData;
};


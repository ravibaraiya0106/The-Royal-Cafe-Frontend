import { getRequest, patchRequest, postRequest } from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

export const ordersList = async (params?: Record<string, unknown>) => {
  const res = await getRequest(ENDPOINTS.ORDER.LIST, params);
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

export const getAdminAnalyticsService = async () => {
  const res = await getRequest(ENDPOINTS.ORDER.ADMIN_ANALYTICS);
  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);
  return responseData;
};

export const updatePaymentStatusService = async (
  id: string,
  payment_status: "paid" | "pending" | "failed",
) => {
  const res = await patchRequest(ENDPOINTS.ORDER.UPDATE_PAYMENT_STATUS(id), {
    payment_status,
  });
  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);
  return responseData;
};

export const cancelOrderService = async (id: string, reason: string) => {
  const res = await postRequest(ENDPOINTS.ORDER.CANCEL(id), { reason });
  const { success, message, responseData } = res.data;

  if (!success) throw new Error(message);
  return { message, data: responseData };
};


import { getRequest, postRequest, patchRequest } from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

export type DeliveryItem = {
  _id: string;
  order: {
    _id: string;
    order_number: string;
    total_amount: number;
    final_amount: number;
    payment_method: string;
    payment_status: string;
    order_status: string;
    address: string;
    phone: string;
    notes?: string;
    createdAt: string;
    user?: {
      _id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone_no: string;
    };
    items?: Array<{
      _id: string;
      product_name: string;
      price: number;
      quantity: number;
      subtotal: number;
    }>;
  };
  delivery_person: {
    _id: string;
    name: string;
    phone: string;
    vehicle_type: string;
    vehicle_number: string;
    is_available: boolean;
  };
  delivery_status: "assigned" | "picked" | "out_for_delivery" | "delivered" | "cancelled";
  delivered_at?: string;
  pickup_at?: string;
  notes?: string;
  cash_collected?: number;
  createdAt: string;
};

export type DeliveryPersonProfile = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_type: string;
  vehicle_number: string;
  is_available: boolean;
};

export type GetMyDeliveriesResponse = {
  delivery_person: DeliveryPersonProfile;
  data: DeliveryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ================= ASSIGN DELIVERY (ADMIN) ================= */
export const assignDeliveryService = async (data: {
  orderId: string;
  deliveryPersonId: string;
  notes?: string;
}) => {
  const res = await postRequest(ENDPOINTS.DELIVERY.ASSIGN, data);
  const { success, message, responseData, data: resData } = res.data;
  if (!success) throw new Error(message);
  return { data: responseData || resData, message };
};

/* ================= GET MY DELIVERIES (DELIVERY BOY) ================= */
export const getMyDeliveriesService = async (params: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<GetMyDeliveriesResponse> => {
  const res = await getRequest(ENDPOINTS.DELIVERY.MY_DELIVERIES, params);
  const { success, message, responseData, data: resData } = res.data;
  if (!success) throw new Error(message);
  return responseData || resData;
};

/* ================= GET DELIVERY DETAILS ================= */
export const getDeliveryDetailsService = async (id: string): Promise<DeliveryItem> => {
  const res = await getRequest(ENDPOINTS.DELIVERY.DETAILS(id));
  const { success, message, responseData, data: resData } = res.data;
  if (!success) throw new Error(message);
  return responseData || resData;
};

/* ================= UPDATE DELIVERY STATUS ================= */
export const updateDeliveryStatusService = async (
  id: string,
  data: {
    status: string;
    cash_collected?: number;
    notes?: string;
  },
) => {
  const res = await patchRequest(ENDPOINTS.DELIVERY.UPDATE_STATUS(id), data);
  const { success, message, responseData, data: resData } = res.data;
  if (!success) throw new Error(message);
  return { data: responseData || resData, message };
};

/* ================= TOGGLE AVAILABILITY ================= */
export const toggleAvailabilityService = async (is_available?: boolean) => {
  const res = await patchRequest(ENDPOINTS.DELIVERY.TOGGLE_AVAILABILITY, {
    is_available,
  });
  const { success, message, responseData, data: resData } = res.data;
  if (!success) throw new Error(message);
  return { data: responseData || resData, message };
};

/* ================= UPDATE LOCATION ================= */
export const updateLocationService = async (lat: number, lng: number) => {
  const res = await patchRequest(ENDPOINTS.DELIVERY.UPDATE_LOCATION, { lat, lng });
  const { success, message } = res.data;
  if (!success) throw new Error(message);
  return message;
};

/* ================= GET DELIVERY ANALYTICS ================= */
export const getDeliveryAnalyticsService = async () => {
  const res = await getRequest(ENDPOINTS.DELIVERY.ANALYTICS);
  const { success, message, responseData, data: resData } = res.data;
  if (!success) throw new Error(message);
  return responseData || resData;
};

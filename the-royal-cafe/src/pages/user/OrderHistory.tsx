import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { ROUTES } from "@/constants/navigation";
import { ordersList } from "@/services/orderService";
import { toastError } from "@/utils/toast";
import { Link } from "react-router-dom";
import { FiTruck, FiMapPin } from "react-icons/fi";
import TrackOrderModal, { type OrderTrackInfo } from "@/components/orders/TrackOrderModal";

type UserOrder = {
  _id: string;
  order_number: string;
  discount_amount?: number;
  coupon?: null | {
    code: string;
    description?: string;
    discount_type?: "percentage" | "flat" | string;
    discount_value?: number;
    min_order_amount?: number;
    max_discount?: number | null;
    expiry_date?: string;
  };
  final_amount: number;
  payment_method: "COD" | "RAZORPAY" | "CARD" | string;
  payment_status: "pending" | "paid" | "failed" | string;
  order_status: string;
  createdAt: string;
  deliveryLocation?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  phone: string;
  delivery_person?: {
    name: string;
    phone: string;
    vehicle_type?: string;
    vehicle_number?: string;
  };
};

const OrderHistory = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [selectedTrackOrder, setSelectedTrackOrder] = useState<OrderTrackInfo | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersList();
      setOrders(Array.isArray(res) ? res : []);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = useMemo(() => {
    return (iso: string) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    };
  }, []);

  const formatMoney = useMemo(() => {
    return (value: number) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value);
  }, []);

  const getStatusChip = (status: string) => {
    const s = status.toLowerCase();
    if (s === "delivered")
      return "bg-green-50 text-green-700 border-green-200";
    if (s === "cancelled")
      return "bg-red-50 text-red-700 border-red-200";
    if (s === "confirmed" || s === "preparing" || s === "out_for_delivery")
      return "bg-brand/5 text-brand border-brand/20";
    if (s === "pending")
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <>
      <Navbar />
      <div className="mt-10 mb-10 px-4 max-w-screen-xl mx-auto min-h-[60vh]">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand font-serif">Order History</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Track active deliveries in real time and view your past orders.
            </p>
          </div>

          <Link
            to={ROUTES.ITEMS}
            className="px-4 py-2 border border-brand text-brand font-semibold text-xs rounded-[5px] hover:bg-brand hover:text-white transition shadow-2xs"
          >
            + Order More Items
          </Link>
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-500 text-sm">
            Loading your orders...
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-[5px] p-8 text-center shadow-sm">
            <FiTruck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No Orders Placed Yet</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Explore our delicious menu items and place your first order today!
            </p>
            <Link
              to={ROUTES.ITEMS}
              className="inline-block bg-brand text-white px-6 py-2.5 rounded-[5px] font-bold text-xs shadow-xs hover:bg-brand/90 transition"
            >
              Browse Cafe Menu
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.order_number}
                className="bg-white border border-gray-200 rounded-[5px] p-5 shadow-sm hover:border-brand/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <span className="text-xs text-gray-500 font-mono block">Order ID</span>
                    <p className="font-bold text-gray-900 text-base">
                      #{o.order_number}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Placed on {formatDate(o.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-[5px] border uppercase ${getStatusChip(
                        o.order_status,
                      )}`}
                    >
                      {o.order_status.replace(/_/g, " ")}
                    </span>

                    {/* Track Live Order Option */}
                    {o.order_status.toLowerCase() !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => setSelectedTrackOrder(o)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand text-white text-xs font-bold rounded-[5px] hover:bg-brand/90 transition-all shadow-2xs"
                      >
                        <FiTruck className="w-3.5 h-3.5" />
                        <span>Track Live Order</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap text-xs">
                  <p className="text-gray-700">
                    Total Amount:{" "}
                    <span className="font-bold text-brand text-sm">
                      {formatMoney(o.final_amount)}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Payment Method:{" "}
                    <span className="font-semibold text-gray-900">
                      {o.payment_method} ({o.payment_status})
                    </span>
                  </p>
                </div>

                {o.coupon && (
                  <div className="mt-2.5 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-[5px] border border-gray-100 space-y-0.5">
                    <p>
                      <span className="font-semibold text-gray-900">Applied Coupon:</span>{" "}
                      <span className="font-mono font-bold text-brand">{o.coupon.code}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Discount Saved:</span>{" "}
                      -{formatMoney(o.discount_amount ?? 0)}
                    </p>
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-600 space-y-1">
                  <p className="flex items-start gap-1">
                    <FiMapPin className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-900">Delivery Address:</strong>{" "}
                      {o.deliveryLocation?.address || "Delivery address missing"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Track Order Live Modal */}
      {selectedTrackOrder && (
        <TrackOrderModal
          order={selectedTrackOrder}
          onClose={() => setSelectedTrackOrder(null)}
        />
      )}

      <Footer />
    </>
  );
};

export default OrderHistory;

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { ROUTES } from "@/constants/Navigation";
import { ordersList } from "@/services/orderService";
import { toastError } from "@/utils/toast";
import { Link } from "react-router-dom";

type UserOrder = {
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
  payment_method: "COD" | "UPI" | "CARD" | string;
  payment_status: "pending" | "paid" | "failed" | string;
  order_status: string;
  createdAt: string;
  address: string;
  phone: string;
};

const OrderHistory = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<UserOrder[]>([]);

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
      new Intl.NumberFormat(undefined, {
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
    if (s === "confirmed" || s === "preparing")
      return "bg-brand/5 text-brand border-brand/20";
    if (s === "pending")
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <>
      <Navbar />
      <div className="mt-10 mb-10 px-4 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-brand mb-2">Order History</h1>
        <p className="text-gray-600 mb-6">
          View your past orders and their current statuses.
        </p>

        {loading && <p className="text-gray-600">Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-gray-600">No orders found.</p>
            <div className="mt-4">
              <Link
                to={ROUTES.ITEMS}
                className="inline-block border border-brand text-brand px-6 py-3 rounded-[5px] shadow hover:bg-brand hover:text-white transition"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.order_number}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Order #{o.order_number}
                    </p>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(o.createdAt)}
                    </p>
                  </div>

                  <div
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusChip(
                      o.order_status,
                    )}`}
                  >
                    {o.order_status}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-gray-700">
                    Total:{" "}
                    <span className="font-semibold text-gray-900">
                      {formatMoney(o.final_amount)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment:{" "}
                    <span className="font-semibold text-gray-900">
                      {o.payment_method} ({o.payment_status})
                    </span>
                  </p>
                </div>

                {o.coupon ? (
                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold text-gray-900">Coupon:</span>{" "}
                      {o.coupon.code}
                    </p>
                    {o.coupon.description ? (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {o.coupon.description}
                      </p>
                    ) : null}
                    <p>
                      <span className="font-semibold text-gray-900">Discount:</span>{" "}
                      -{formatMoney(o.discount_amount ?? 0)}
                    </p>
                  </div>
                ) : null}

                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-900">
                      Deliver to:
                    </span>{" "}
                    {o.address}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Phone:</span>{" "}
                    {o.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;


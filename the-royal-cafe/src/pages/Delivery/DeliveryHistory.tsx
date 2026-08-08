import { useEffect, useState, useCallback } from "react";
import { FiCheckCircle, FiMapPin, FiCalendar } from "react-icons/fi";
import DeliveryLayout from "@/Layouts/DeliveryLayout";
import {
  getMyDeliveriesService,
  type DeliveryItem,
} from "@/services/deliveryService";
import { toastError } from "@/utils/toast";

const DeliveryHistory = () => {
  const [history, setHistory] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyDeliveriesService({ status: "completed", limit: 20 });
      setHistory(res.data || []);
    } catch (err: unknown) {
      toastError(
        err instanceof Error ? err.message : "Failed to load delivery history",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatMoney = (val?: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <DeliveryLayout>
      <div className="space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-brand font-serif">
              Delivery History
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Log of your past completed delivery tasks.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 font-bold text-xs">
            {history.length} Completed
          </span>
        </div>

        {/* History List */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Loading delivery history...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <FiCheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700">
              No Delivery History Found
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Completed delivery tasks will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              const order = item.order;
              return (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-gray-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-brand">
                        #{order?.order_number || "ORDER"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                        <FiCheckCircle className="w-3 h-3" />
                        Delivered
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {formatMoney(order?.final_amount)}
                      </span>
                      <span className="text-[10px] text-gray-500 block font-semibold">
                        Payment: {order?.payment_method || "COD"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-brand shrink-0" />
                      <span>
                        Delivered on:{" "}
                        <strong className="text-gray-800">
                          {item.delivered_at
                            ? new Date(item.delivered_at).toLocaleString()
                            : new Date(item.createdAt).toLocaleString()}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-brand shrink-0" />
                      <span className="truncate">{order?.address || "Address"}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs text-gray-600">
                      <strong className="text-gray-700">Notes:</strong> {item.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryHistory;

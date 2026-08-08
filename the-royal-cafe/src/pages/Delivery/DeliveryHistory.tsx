import { useEffect, useState, useCallback, useMemo } from "react";
import { FiCheckCircle, FiMapPin, FiCalendar } from "react-icons/fi";
import DeliveryLayout from "@/Layouts/DeliveryLayout";
import Filter from "@/components/Admin/common/Filter";
import Pagination from "@/components/Admin/common/Pagination";
import {
  getMyDeliveriesService,
  type DeliveryItem,
} from "@/services/deliveryService";
import { toastError } from "@/utils/toast";

const DeliveryHistory = () => {
  const [history, setHistory] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    status: "completed",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchHistory = useCallback(async (params = filters) => {
    try {
      setLoading(true);
      const res = await getMyDeliveriesService(params);
      setHistory(res.data || []);
      setPagination({
        page: res.page || 1,
        totalPages: res.totalPages || 1,
        totalItems: res.total || 0,
      });
    } catch (err: unknown) {
      toastError(
        err instanceof Error ? err.message : "Failed to load delivery history",
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHistory(filters);
  }, [fetchHistory, filters]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleFilterChange = (values: Record<string, unknown>) => {
    if (Object.keys(values).length === 0) {
      setFilters({
        page: 1,
        limit: 5,
        status: "completed",
      });
      return;
    }
    setFilters((prev) => ({
      ...prev,
      ...values,
      page: 1,
    }));
  };

  const formatMoney = (val?: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const filterFields = useMemo(
    () => [
      {
        key: "status",
        label: "History Status Filter",
        type: "select" as const,
        options: [
          { label: "Completed (Delivered)", value: "completed" },
        ],
      },
    ],
    [],
  );

  return (
    <DeliveryLayout>
      <div className="space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between bg-white p-5 rounded-[5px] border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-brand font-serif">
              Delivery History
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Log of your past completed delivery tasks.
            </p>
          </div>
          <span className="px-3 py-1 rounded-[5px] bg-green-50 text-green-700 border border-green-200 font-bold text-xs">
            {pagination.totalItems} Completed
          </span>
        </div>

        {/* Filter Bar */}
        <Filter filters={filterFields} onChange={handleFilterChange} />

        {/* History List */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Loading delivery history...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[5px] border border-gray-200 shadow-sm">
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
                  className="bg-white border border-gray-200 rounded-[5px] p-5 shadow-sm hover:border-gray-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-brand">
                        #{order?.order_number || "ORDER"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
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
                    <div className="bg-white p-2.5 rounded-[5px] border border-gray-200 text-xs text-gray-600">
                      <strong className="text-gray-700">Notes:</strong> {item.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          limit={filters.limit}
          onPageChange={handlePageChange}
        />
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryHistory;

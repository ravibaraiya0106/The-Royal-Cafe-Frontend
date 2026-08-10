import { useEffect, useState, useCallback, useMemo } from "react";
import {
  FiPackage,
  FiMapPin,
  FiPhone,
  FiNavigation,
} from "react-icons/fi";
import DeliveryLayout from "@/Layouts/DeliveryLayout";
import CompleteDeliveryModal from "@/components/Delivery/modals/CompleteDeliveryModal";
import Filter from "@/components/Admin/common/Filter";
import Pagination from "@/components/Admin/common/Pagination";
import { PrimaryButton } from "@/components/common/form/Button";
import {
  getMyDeliveriesService,
  updateDeliveryStatusService,
  type DeliveryItem,
} from "@/services/deliveryService";
import { useLiveLocationTracker } from "@/hooks/useLiveLocationTracker";
import LiveDeliveryMap from "@/components/common/LiveDeliveryMap";
import { toastSuccess, toastError } from "@/utils/toast";

const DeliveryOrders = () => {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    status: "active",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Modal state for COD completion confirmation
  const [selectedTask, setSelectedTask] = useState<DeliveryItem | null>(null);
  const [cashCollected, setCashCollected] = useState<number>(0);
  const [deliveryNotes, setDeliveryNotes] = useState<string>("");
  const [completing, setCompleting] = useState(false);

  const activeTask = deliveries.find(
    (d) =>
      d.delivery_status === "out_for_delivery",
  );

  const { isWatching, currentLocation } = useLiveLocationTracker({
    isTrackingActive: !!activeTask,
    deliveryId: activeTask?._id,
    orderId: activeTask?.order?._id,
  });

  const fetchActiveDeliveries = useCallback(async (params = filters) => {
    try {
      setLoading(true);
      const res = await getMyDeliveriesService(params);
      setDeliveries(res.data || []);
      setPagination({
        page: res.page || 1,
        totalPages: res.totalPages || 1,
        totalItems: res.total || 0,
      });
    } catch (err: unknown) {
      toastError(
        err instanceof Error ? err.message : "Failed to load active orders",
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchActiveDeliveries(filters);
  }, [fetchActiveDeliveries, filters]);

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
        status: "active",
      });
      return;
    }
    setFilters((prev) => ({
      ...prev,
      ...values,
      page: 1,
    }));
  };

  const handleQuickStatus = async (id: string, nextStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await updateDeliveryStatusService(id, { status: nextStatus });
      toastSuccess(res.message);
      fetchActiveDeliveries(filters);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const openDeliveredModal = (task: DeliveryItem) => {
    setSelectedTask(task);
    setCashCollected(
      task.order?.payment_method === "COD" ? task.order?.final_amount || 0 : 0,
    );
    setDeliveryNotes("");
  };

  const handleCompleteDeliverySubmit = async () => {
    if (!selectedTask) return;

    try {
      setCompleting(true);
      const res = await updateDeliveryStatusService(selectedTask._id, {
        status: "delivered",
        cash_collected: cashCollected,
        notes: deliveryNotes,
      });

      toastSuccess(res.message);
      setSelectedTask(null);
      fetchActiveDeliveries(filters);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to complete delivery");
    } finally {
      setCompleting(false);
    }
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
        label: "Delivery Status Filter",
        type: "select" as const,
        options: [
          { label: "Active Tasks", value: "active" },
          { label: "Assigned", value: "assigned" },
          { label: "Picked Up", value: "picked" },
          { label: "Out for Delivery", value: "out_for_delivery" },
        ],
      },
    ],
    [],
  );

  return (
    <DeliveryLayout>
      <div className="space-y-6">
        {/* Title Header */}
        <div className="flex items-center justify-between bg-white p-5 rounded-[5px] border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-brand font-serif">
              Active Delivery Orders
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Your assigned pickup and delivery tasks for execution.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isWatching && (
              <span className="px-3 py-1 rounded-[5px] bg-green-50 text-green-700 border border-green-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping inline-block" />
                Live GPS Broadcast Active
              </span>
            )}
            <span className="px-3 py-1 rounded-[5px] bg-brand/10 text-brand border border-brand/20 font-bold text-xs">
              {pagination.totalItems} Tasks Pending
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <Filter filters={filterFields} onChange={handleFilterChange} />

        {/* Task Cards List */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Fetching active delivery assignments...
          </div>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[5px] border border-gray-200 shadow-sm">
            <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700">
              No Active Delivery Tasks
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              All assigned orders have been completed. Check back when new orders are assigned!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {deliveries.map((task) => {
              const order = task.order;
              const status = task.delivery_status;
              const isCOD = order?.payment_method === "COD";

              return (
                <div
                  key={task._id}
                  className="bg-white border border-gray-200 rounded-[5px] p-5 shadow-sm space-y-4 hover:border-brand/40 transition-all"
                >
                  {/* Card Top Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[5px] bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold">
                        <FiPackage className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono text-lg font-bold text-brand block leading-tight">
                          #{order?.order_number || "ORDER"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Assigned: {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-[5px] text-xs font-bold uppercase tracking-wider border ${
                          status === "assigned"
                            ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                            : status === "picked"
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-purple-50 border-purple-200 text-purple-700"
                        }`}
                      >
                        {status.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-[5px] text-xs font-bold uppercase tracking-wider border ${
                          isCOD
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-green-50 border-green-200 text-green-700"
                        }`}
                      >
                        {isCOD ? "COD Cash" : "Prepaid"}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-[5px] border border-gray-200 text-sm">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-brand uppercase tracking-wider block">
                        Customer Details
                      </span>
                      <p className="text-gray-900 font-medium">
                        {order?.user?.first_name ? `${order.user.first_name} ${order.user.last_name || ""}` : "Valued Customer"}
                      </p>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiPhone className="w-4 h-4 text-green-600 shrink-0" />
                        <a
                          href={`tel:${order?.phone}`}
                          className="hover:text-brand font-semibold underline"
                        >
                          {order?.phone || "No phone provided"}
                        </a>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-brand uppercase tracking-wider block">
                        Delivery Address
                      </span>
                      <div className="flex items-start gap-2 text-gray-700">
                        <FiMapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                        <span>{order?.deliveryLocation?.address || "Address details missing"}</span>
                      </div>
                      {order?.deliveryLocation?.latitude &&
                        order?.deliveryLocation?.longitude && (
                          <a
                            href={
                              currentLocation?.latitude != null &&
                              currentLocation?.longitude != null
                                ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(
                                    `${currentLocation.latitude},${currentLocation.longitude};${order.deliveryLocation.latitude},${order.deliveryLocation.longitude}`,
                                  )}`
                                : order?.deliveryTracking?.latitude != null &&
                                  order?.deliveryTracking?.longitude != null
                                  ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(
                                      `${order.deliveryTracking.latitude},${order.deliveryTracking.longitude};${order.deliveryLocation.latitude},${order.deliveryLocation.longitude}`,
                                    )}`
                                  : `https://www.openstreetmap.org/?mlat=${order.deliveryLocation.latitude}&mlon=${order.deliveryLocation.longitude}#map=15/${order.deliveryLocation.latitude}/${order.deliveryLocation.longitude}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-brand hover:underline font-semibold mt-1"
                          >
                            <FiNavigation className="w-3.5 h-3.5" />
                            <span>Open in OpenStreetMap</span>
                          </a>
                        )}

                      {/* Live Leaflet Real-time Map View */}
                      <div className="mt-3">
                        <LiveDeliveryMap
                          orderId={order?._id}
                          destinationCoords={
                            order?.deliveryLocation?.latitude &&
                            order?.deliveryLocation?.longitude
                              ? {
                                  lat: order.deliveryLocation.latitude,
                                  lng: order.deliveryLocation.longitude,
                                }
                              : undefined
                          }
                          destinationAddress={order?.deliveryLocation?.address}
                          height="240px"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Itemized Order Summary */}
                  {order?.items && order.items.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                        Items Ordered ({order.items.length})
                      </span>
                      <div className="bg-white rounded-[5px] p-3 border border-gray-200 space-y-1.5 text-xs">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-gray-700 py-0.5"
                          >
                            <span>
                              <strong className="text-brand font-semibold">
                                {item.quantity}x
                              </strong>{" "}
                              {item.product_name}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {formatMoney(item.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment & Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-200">
                    <div>
                      <span className="text-xs text-gray-500 block">Total Collectible Amount</span>
                      <span className="text-xl font-bold text-brand">
                        {formatMoney(order?.final_amount)}
                      </span>
                      {isCOD && (
                        <span className="text-[11px] text-red-600 block font-semibold">
                          ⚠️ Collect Cash on Delivery
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {status === "assigned" && (
                        <button
                          onClick={() => handleQuickStatus(task._id, "picked")}
                          disabled={updatingId === task._id}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-[5px] shadow-sm transition-all disabled:opacity-50"
                        >
                          1. Mark Picked Up
                        </button>
                      )}

                      {status === "picked" && (
                        <button
                          onClick={() => handleQuickStatus(task._id, "out_for_delivery")}
                          disabled={updatingId === task._id}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-[5px] shadow-sm transition-all disabled:opacity-50"
                        >
                          2. Out for Delivery
                        </button>
                      )}

                      <PrimaryButton
                        label="Complete Delivery"
                        onClick={() => openDeliveredModal(task)}
                      />
                    </div>
                  </div>
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

      <CompleteDeliveryModal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        orderNumber={selectedTask?.order?.order_number || ""}
        paymentMethod={selectedTask?.order?.payment_method || "COD"}
        finalAmount={selectedTask?.order?.final_amount || 0}
        cashCollected={cashCollected}
        onChangeCashCollected={(val) => setCashCollected(val)}
        deliveryNotes={deliveryNotes}
        onChangeDeliveryNotes={(notes) => setDeliveryNotes(notes)}
        onSubmit={handleCompleteDeliverySubmit}
        loading={completing}
      />
    </DeliveryLayout>
  );
};

export default DeliveryOrders;

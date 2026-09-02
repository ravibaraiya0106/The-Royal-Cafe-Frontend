import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPhone,
  FiArrowRight,
  FiRefreshCw,
  FiTruck,
} from "react-icons/fi";
import DeliveryLayout from "@/Layouts/DeliveryLayout";
import { PrimaryButton } from "@/components/common/form/Button";
import {
  DeliveryPerformanceChart,
  OrderStatusDonutChart,
  type BarChartDataPoint,
  type PieChartSegment,
} from "@/components/common/DashboardCharts";
import {
  getMyDeliveriesService,
  updateDeliveryStatusService,
  getDeliveryAnalyticsService,
  type DeliveryItem,
} from "@/services/deliveryService";
import { ROUTES } from "@/constants/navigation";
import { toastSuccess, toastError } from "@/utils/toast";

const DeliveryDashboard = () => {
  const [activeTasks, setActiveTasks] = useState<DeliveryItem[]>([]);
  const [completedTasks, setCompletedTasks] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [performanceTrend, setPerformanceTrend] = useState<BarChartDataPoint[]>([]);
  const [statusDonutData, setStatusDonutData] = useState<PieChartSegment[]>([]);
  const [totalCashCollected, setTotalCashCollected] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [activeRes, completedRes, analyticsData] = await Promise.all([
        getMyDeliveriesService({ status: "active", limit: 10 }),
        getMyDeliveriesService({ status: "completed", limit: 10 }),
        getDeliveryAnalyticsService(),
      ]);

      setActiveTasks(activeRes.data || []);
      setCompletedTasks(completedRes.data || []);

      if (analyticsData) {
        setPerformanceTrend(analyticsData.performanceTrend || []);
        setTotalCashCollected(analyticsData.totalCashCollected || 0);

        const sb = analyticsData.statusBreakdown || {};
        setStatusDonutData([
          { label: "Assigned", value: sb.assigned || 0, color: "#d97706" },
          { label: "Picked Up", value: sb.picked || 0, color: "#2563eb" },
          { label: "Out for Delivery", value: sb.out_for_delivery || 0, color: "#9333ea" },
          { label: "Delivered", value: sb.delivered || 0, color: "#16a34a" },
        ]);
      }
    } catch (err: unknown) {
      toastError(
        err instanceof Error ? err.message : "Failed to load delivery data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const handleNewAssignedEvent = () => {
      fetchDashboardData();
    };

    window.addEventListener("orderAssigned", handleNewAssignedEvent);
    return () => {
      window.removeEventListener("orderAssigned", handleNewAssignedEvent);
    };
  }, [fetchDashboardData]);

  const handleStatusUpdate = async (id: string, nextStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await updateDeliveryStatusService(id, { status: nextStatus });
      toastSuccess(res.message);
      fetchDashboardData();
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatMoney = (val?: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <DeliveryLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[5px] border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-brand font-serif">
              Delivery Overview
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage your active delivery assignments and track your live performance.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-gray-50 text-brand rounded-[5px] text-xs font-semibold border border-gray-300 flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Metric Cards Grid - rounded-[5px] */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 p-5 rounded-[5px] flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-[5px] bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <FiPackage className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Active Tasks
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {activeTasks.length}
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-[5px] flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-[5px] bg-green-50 border border-green-200 flex items-center justify-center text-green-700">
              <FiCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Completed
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {completedTasks.length}
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-[5px] flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-[5px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <FiTruck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Total Assigned
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {activeTasks.length + completedTasks.length}
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-[5px] flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-[5px] bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <span className="font-bold text-lg">₹</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                COD Cash Collected
              </span>
              <span className="text-xl font-bold text-brand">
                {formatMoney(totalCashCollected)}
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DeliveryPerformanceChart
              data={performanceTrend}
              title="Daily Delivery Completion Rate"
              subtitle="7-day aggregated count of completed deliveries"
            />
          </div>
          <div>
            <OrderStatusDonutChart
              data={statusDonutData}
              title="Task Status Breakdown"
              totalCount={activeTasks.length + completedTasks.length}
            />
          </div>
        </div>

        {/* Active Delivery Section */}
        <div className="bg-white border border-gray-200 rounded-[5px] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              <h2 className="text-lg font-bold text-gray-900 font-serif">Active Delivery Tasks</h2>
            </div>
            <Link
              to={ROUTES.DELIVERY_ORDERS}
              className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
            >
              <span>View All Tasks</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              Loading active assignments...
            </div>
          ) : activeTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[5px] border border-gray-200">
              <FiPackage className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-medium">No active delivery tasks assigned</p>
              <p className="text-xs text-gray-400 mt-1">
                You will be notified when a new delivery task is assigned.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTasks.map((task) => {
                const order = task.order;
                const status = task.delivery_status;

                return (
                  <div
                    key={task._id}
                    className="bg-white border border-gray-200 rounded-[5px] p-5 hover:border-brand/40 transition-all shadow-sm space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-bold text-brand">
                            #{order?.order_number || "ORDER"}
                          </span>
                          <span
                            className={`px-3 py-0.5 rounded-[5px] text-xs font-semibold uppercase tracking-wider border ${
                              status === "assigned"
                                ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                                : status === "picked"
                                  ? "bg-blue-50 border-blue-200 text-blue-700"
                                  : "bg-purple-50 border-purple-200 text-purple-700"
                            }`}
                          >
                            {status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>
                            Customer:{" "}
                            <strong className="text-gray-800">
                              {order?.user?.first_name ? `${order.user.first_name} ${order.user.last_name || ""}` : "Customer"}
                            </strong>
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">Total Amount</span>
                        <span className="text-lg font-bold text-brand">
                          {formatMoney(order?.final_amount)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-[5px] ml-2 ${
                            order?.payment_method === "COD"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-green-50 text-green-700 border border-green-200"
                          }`}
                        >
                          {order?.payment_method || "COD"}
                        </span>
                      </div>
                    </div>

                    {/* Address & Contact */}
                    <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-start gap-2 text-gray-700">
                        <FiMapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-gray-500 block">Delivery Address:</span>
                          <span>
                            {order?.deliveryLocation?.address || "Address not available"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <FiPhone className="w-4 h-4 text-green-600 shrink-0" />
                        <div>
                          <span className="font-semibold text-gray-500 block">Phone:</span>
                          <a
                            href={`tel:${order?.phone || ""}`}
                            className="text-brand underline font-semibold"
                          >
                            {order?.phone || "No phone"}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
                      {status === "assigned" && (
                        <button
                          onClick={() => handleStatusUpdate(task._id, "picked")}
                          disabled={updatingId === task._id}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-[5px] shadow-sm transition-all disabled:opacity-50"
                        >
                          Mark Picked Up
                        </button>
                      )}

                      {status === "picked" && (
                        <button
                          onClick={() => handleStatusUpdate(task._id, "out_for_delivery")}
                          disabled={updatingId === task._id}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-[5px] shadow-sm transition-all disabled:opacity-50"
                        >
                          Out for Delivery
                        </button>
                      )}

                      {(status === "out_for_delivery" || status === "picked" || status === "assigned") && (
                        <PrimaryButton
                          label="Complete Delivery"
                          onClick={() => handleStatusUpdate(task._id, "delivered")}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryDashboard;

import { useEffect, useState, useCallback } from "react";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiTruck,
  FiArrowUpRight,
  FiRefreshCw,
} from "react-icons/fi";
import AdminLayout from "@/Layouts/AdminLayout";
import {
  RevenueTrendBarChart,
  OrderStatusDonutChart,
  type BarChartDataPoint,
  type PieChartSegment,
} from "@/components/common/DashboardCharts";
import { getAdminAnalyticsService } from "@/services/orderService";
import { toastError } from "@/utils/toast";

type StatSummary = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalDeliveryPersons: number;
  onlineDeliveryPersons: number;
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatSummary>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalDeliveryPersons: 0,
    onlineDeliveryPersons: 0,
  });

  const [revenueTrend, setRevenueTrend] = useState<BarChartDataPoint[]>([]);
  const [statusSegments, setStatusSegments] = useState<PieChartSegment[]>([]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminAnalyticsService();

      setStats({
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        totalCustomers: data.totalCustomers || 0,
        totalDeliveryPersons: data.totalDeliveryPersons || 0,
        onlineDeliveryPersons: data.onlineDeliveryPersons || 0,
      });

      // Daily trend array
      setRevenueTrend(data.dailyTrend || []);

      // Order status breakdown map
      const sb = data.statusBreakdown || {};
      setStatusSegments([
        { label: "Confirmed", value: sb.confirmed || 0, color: "#d97706" },
        { label: "Preparing", value: sb.preparing || 0, color: "#2563eb" },
        { label: "Delivered", value: sb.delivered || 0, color: "#16a34a" },
        { label: "Cancelled", value: sb.cancelled || 0, color: "#dc2626" },
      ]);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();

    const handleDashboardUpdate = () => {
      fetchDashboardStats();
    };

    window.addEventListener("adminOrderUpdated", handleDashboardUpdate);
    return () => {
      window.removeEventListener("adminOrderUpdated", handleDashboardUpdate);
    };
  }, [fetchDashboardStats]);

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[5px] border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-brand font-serif">
              Executive Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Real-time analytics, sales trends, and delivery operations status.
            </p>
          </div>
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-gray-50 text-brand rounded-[5px] text-xs font-semibold border border-gray-300 flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* KPI Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Revenue */}
          <div className="bg-white border border-gray-200 p-5 rounded-[5px] shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Total Store Revenue
              </span>
              <span className="text-2xl font-bold text-gray-900 block mt-1">
                {formatMoney(stats.totalRevenue)}
              </span>
              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 mt-1">
                <FiArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                Total Paid & Delivered Sales
              </span>
            </div>
            <div className="w-12 h-12 rounded-[5px] bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <FiDollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white border border-gray-200 p-5 rounded-[5px] shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Total Orders Count
              </span>
              <span className="text-2xl font-bold text-gray-900 block mt-1">
                {stats.totalOrders}
              </span>
              <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 mt-1">
                <FiShoppingBag className="w-3.5 h-3.5 mr-0.5" />
                Total Lifetime Orders Placed
              </span>
            </div>
            <div className="w-12 h-12 rounded-[5px] bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <FiShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Delivery Staff */}
          <div className="bg-white border border-gray-200 p-5 rounded-[5px] shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Delivery Staff Status
              </span>
              <span className="text-2xl font-bold text-gray-900 block mt-1">
                {stats.onlineDeliveryPersons} / {stats.totalDeliveryPersons}
              </span>
              <span className="inline-flex items-center text-[11px] font-semibold text-blue-600 mt-1">
                🛵 {stats.onlineDeliveryPersons} Active & Available Staff
              </span>
            </div>
            <div className="w-12 h-12 rounded-[5px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <FiTruck className="w-6 h-6" />
            </div>
          </div>

          {/* Customers */}
          <div className="bg-white border border-gray-200 p-5 rounded-[5px] shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Active Customers
              </span>
              <span className="text-2xl font-bold text-gray-900 block mt-1">
                {stats.totalCustomers}
              </span>
              <span className="inline-flex items-center text-[11px] font-semibold text-purple-600 mt-1">
                <FiUsers className="w-3.5 h-3.5 mr-0.5" />
                Total Verified Customer Accounts
              </span>
            </div>
            <div className="w-12 h-12 rounded-[5px] bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueTrendBarChart
              data={revenueTrend}
              title="7-Day Store Sales & Order Volume"
              subtitle="Daily aggregated sales revenue in INR"
            />
          </div>
          <div>
            <OrderStatusDonutChart
              data={statusSegments}
              title="Live Order Statuses"
              totalCount={stats.totalOrders}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

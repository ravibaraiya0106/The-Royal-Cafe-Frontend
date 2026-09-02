import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import dayjs from "dayjs";
import { adminOrdersList } from "@/services/orderService";
import { toastError } from "@/utils/toast";
import Pagination from "@/components/Admin/common/Pagination";
import Filter from "@/components/Admin/common/Filter";
import { FiXCircle, FiUser, FiPhone, FiCalendar, FiAlertCircle } from "react-icons/fi";

type CancelledOrder = {
  _id: string;
  order_number: string;
  user?:
    | {
        _id: string;
        username?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
      }
    | string;
  total_amount?: number;
  discount_amount?: number;
  final_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  cancelled_at?: string;
  createdAt: string;
  phone: string;
};

const CancelledOrders = () => {
  const formatMoney = useMemo(() => {
    return (value: number) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value);
  }, []);

  const [orders, setOrders] = useState<CancelledOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    order_number: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchCancelledOrders = useCallback(async (params = filters) => {
    try {
      setLoading(true);
      const queryParams = {
        ...params,
        order_status: "cancelled",
      };
      const res = await adminOrdersList(queryParams);
      setOrders(res.data || []);
      setPagination({
        page: res.page,
        totalPages: res.totalPages,
        totalItems: res.total,
      });
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to fetch cancelled orders");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCancelledOrders(filters);

    const handleAdminUpdate = () => {
      fetchCancelledOrders(filters);
    };

    window.addEventListener("adminOrderUpdated", handleAdminUpdate);
    return () => {
      window.removeEventListener("adminOrderUpdated", handleAdminUpdate);
    };
  }, [fetchCancelledOrders, filters]);

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
        limit: 10,
        order_number: "",
      });
      return;
    }
    setFilters((prev) => ({
      ...prev,
      page: 1,
      order_number: (values.order_number as string) || "",
    }));
  };

  const columns: Column<CancelledOrder>[] = [
    {
      header: "Order #",
      accessor: "order_number",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 font-mono text-sm">
            #{row.order_number}
          </span>
          <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
            <FiCalendar size={11} />
            {dayjs(row.createdAt).format("MMM D, YYYY h:mm A")}
          </span>
        </div>
      ),
    },
    {
      header: "Customer",
      accessor: "user",
      render: (row) => {
        const u = typeof row.user === "object" ? row.user : null;
        const name = u
          ? `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.username
          : "Guest";
        return (
          <div className="flex flex-col text-xs space-y-0.5">
            <span className="font-semibold text-gray-900 flex items-center gap-1">
              <FiUser className="text-gray-400" size={12} />
              {name}
            </span>
            {u?.email && <span className="text-gray-500 text-[11px]">{u.email}</span>}
            <span className="text-gray-500 text-[11px] flex items-center gap-1">
              <FiPhone className="text-gray-400" size={10} />
              {row.phone || u?.phone || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Amount & Payment",
      accessor: "final_amount",
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-bold text-brand text-sm">
            {formatMoney(row.final_amount)}
          </span>
          <span className="text-[11px] text-gray-500">
            {row.payment_method} ({row.payment_status})
          </span>
        </div>
      ),
    },
    {
      header: "Cancelled By",
      accessor: "cancelled_by",
      align: "center",
      render: (row) => {
        const by = row.cancelled_by?.toLowerCase();
        const isAdmin = by === "admin";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border uppercase ${
              isAdmin
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {isAdmin ? "Admin" : "Customer"}
          </span>
        );
      },
    },
    {
      header: "Cancellation Reason",
      accessor: "cancellation_reason",
      render: (row) => (
        <div className="max-w-xs">
          <div className="bg-red-50 border border-red-200 text-red-900 p-2.5 rounded-lg text-xs space-y-1">
            <p className="font-medium text-red-800 flex items-start gap-1">
              <FiAlertCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
              <span>{row.cancellation_reason || "No reason specified"}</span>
            </p>
            {row.cancelled_at && (
              <span className="text-[10px] text-gray-500 block">
                Cancelled on {dayjs(row.cancelled_at).format("MMM D, YYYY h:mm A")}
              </span>
            )}
          </div>
        </div>
      ),
    },
  ];

  const filterFields = useMemo(
    () => [{ key: "order_number", label: "Order #", type: "text" as const }],
    [],
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FiXCircle className="text-red-600" />
              <span>Cancelled Orders</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Overview of all customer & admin cancelled orders with notes.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span>Total Cancelled:</span>
            <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs">
              {pagination.totalItems}
            </span>
          </div>
        </div>

        <Filter filters={filterFields} onChange={handleFilterChange} />

        <Table columns={columns} data={orders} loading={loading} />

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          limit={filters.limit}
          onPageChange={handlePageChange}
        />
      </div>
    </AdminLayout>
  );
};

export default CancelledOrders;

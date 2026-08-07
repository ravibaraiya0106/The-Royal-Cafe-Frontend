import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import dayjs from "dayjs";
import { adminOrdersList } from "@/services/orderService";
import { toastError } from "@/utils/toast";
import Pagination from "@/components/Admin/common/Pagination";
import Filter from "@/components/Admin/common/Filter";

type AdminOrder = {
  _id?: string;
  order_number: string;
  user: string;
  final_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  createdAt: string;
  address: string;
  phone: string;
};

const Orders = () => {
  const formatMoney = useMemo(() => {
    return (value: number) =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value);
  }, []);

  const statusChip = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered") return "bg-green-50 text-green-700 border-green-200";
    if (s === "cancelled") return "bg-red-50 text-red-700 border-red-200";
    if (s === "pending") return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-brand/5 text-brand border-brand/20";
  };

  const columns: Column<AdminOrder>[] = [
    {
      header: "Order #",
      accessor: "order_number",
      render: (row) => <span className="font-semibold">{row.order_number}</span>,
    },
    {
      header: "User",
      accessor: "user",
      render: (row) => <span className="text-gray-700">{String(row.user || "")}</span>,
    },
    {
      header: "Total",
      accessor: "final_amount",
      align: "right",
      render: (row) => <span className="font-semibold">{formatMoney(row.final_amount)}</span>,
    },
    {
      header: "Payment",
      accessor: "payment_method",
      render: (row) => (
        <span className="text-gray-800">
          {row.payment_method}{" "}
          <span className="text-gray-500">({row.payment_status})</span>
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "order_status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${statusChip(
            row.order_status,
          )}`}
        >
          {row.order_status}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      align: "right",
      render: (row) => (
        <span className="text-gray-600">
          {row.createdAt ? dayjs(row.createdAt).format("MMM D, YYYY") : "-"}
        </span>
      ),
    },
  ];

  const filterFields = useMemo(
    () => [
      { key: "order_number", label: "Order #", type: "text" as const },
      {
        key: "payment_method",
        label: "Payment Method",
        type: "select" as const,
        options: [
          { label: "COD", value: "COD" },
          { label: "UPI", value: "UPI" },
          { label: "CARD", value: "CARD" },
        ],
      },
      {
        key: "payment_status",
        label: "Payment Status",
        type: "select" as const,
        options: [
          { label: "pending", value: "pending" },
          { label: "paid", value: "paid" },
          { label: "failed", value: "failed" },
        ],
      },
      {
        key: "order_status",
        label: "Order Status",
        type: "select" as const,
        options: [
          { label: "pending", value: "pending" },
          { label: "confirmed", value: "confirmed" },
          { label: "preparing", value: "preparing" },
          { label: "delivered", value: "delivered" },
          { label: "cancelled", value: "cancelled" },
        ],
      },
    ],
    [],
  );

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    order_number: "",
    payment_method: "",
    payment_status: "",
    order_status: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchAdminOrders = useCallback(
    async (params: typeof filters) => {
      try {
        setLoading(true);
        const res = await adminOrdersList(params);

        // server shape: { data, total, page, totalPages, limit }
        setOrders(Array.isArray(res?.data) ? res.data : []);
        setPagination({
          page: typeof res?.page === "number" ? res.page : params.page,
          totalPages:
            typeof res?.totalPages === "number" ? res.totalPages : 1,
          totalItems: typeof res?.total === "number" ? res.total : 0,
        });
      } catch (err: unknown) {
        toastError(
          err instanceof Error ? err.message : "Failed to load orders",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchAdminOrders(filters);
  }, [filters, fetchAdminOrders]);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4 text-center text-brand">
          Orders
        </h1>

        <Filter
          filters={filterFields}
          onChange={(values) => {
            const isReset = Object.keys(values).length === 0;

            setFilters((prev) => ({
              ...prev,
              page: 1,
              order_number: isReset ? "" : String(values.order_number ?? ""),
              payment_method: isReset
                ? ""
                : String(values.payment_method ?? ""),
              payment_status: isReset ? "" : String(values.payment_status ?? ""),
              order_status: isReset ? "" : String(values.order_status ?? ""),
            }));
          }}
        />

        <Table columns={columns} data={orders} loading={loading} />

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          limit={filters.limit}
          onPageChange={(nextPage) =>
            setFilters((prev) => ({
              ...prev,
              page: nextPage,
            }))
          }
        />
      </div>
    </AdminLayout>
  );
};

export default Orders;

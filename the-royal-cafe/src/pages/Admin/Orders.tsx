import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import dayjs from "dayjs";
import { adminOrdersList } from "@/services/orderService";
import { deliveryPersonList } from "@/services/deliveryPersonsService";
import { assignDeliveryService } from "@/services/deliveryService";
import { toastSuccess, toastError } from "@/utils/toast";
import Pagination from "@/components/Admin/common/Pagination";
import Filter from "@/components/Admin/common/Filter";
import AssignDeliveryModal from "@/components/Admin/modals/AssignDeliveryModal";
import { FiTruck } from "react-icons/fi";

type AdminOrder = {
  _id: string;
  order_number: string;
  user: string;
  final_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  createdAt: string;
  address: string;
  phone: string;
  delivery?: {
    _id: string;
    delivery_status: string;
    delivery_person?: {
      _id: string;
      name: string;
      phone: string;
      vehicle_type: string;
    };
  };
};

type DeliveryPersonOption = {
  _id: string;
  name: string;
  phone: string;
  vehicle_type: string;
  is_available: boolean;
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

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
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

  /* Modal state for assigning delivery */
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningOrder, setAssigningOrder] = useState<AdminOrder | null>(null);
  const [deliveryStaffList, setDeliveryStaffList] = useState<DeliveryPersonOption[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchOrders = useCallback(async (params = filters) => {
    try {
      setLoading(true);
      const res = await adminOrdersList(params);
      setOrders(res.data || []);
      setPagination({
        page: res.page,
        totalPages: res.totalPages,
        totalItems: res.total,
      });
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders(filters);
  }, [fetchOrders, filters]);

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
        order_number: "",
        payment_method: "",
        payment_status: "",
        order_status: "",
      });
      return;
    }
    setFilters((prev) => ({
      ...prev,
      ...values,
      page: 1,
    }));
  };

  const handleOpenAssignModal = async (order: AdminOrder) => {
    setAssigningOrder(order);
    setAssignModalOpen(true);
    try {
      const res = await deliveryPersonList({ limit: 50 });
      const staffList = (res.data || []).map((p: DeliveryPersonOption) => ({
        _id: p._id,
        name: p.name,
        phone: p.phone,
        vehicle_type: p.vehicle_type,
        is_available: p.is_available,
      }));
      setDeliveryStaffList(staffList);
      if (order.delivery?.delivery_person?._id) {
        setSelectedStaffId(order.delivery.delivery_person._id);
      } else if (staffList.length > 0) {
        setSelectedStaffId(staffList[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch delivery staff list", err);
    }
  };

  const handleAssignSubmit = async () => {
    if (!assigningOrder || !selectedStaffId) return;

    try {
      setAssignLoading(true);
      await assignDeliveryService({
        orderId: assigningOrder._id,
        deliveryPersonId: selectedStaffId,
      });

      toastSuccess(
        `Delivery assigned for Order #${assigningOrder.order_number}!`,
      );
      setAssignModalOpen(false);
      fetchOrders();
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setAssignLoading(false);
    }
  };

  const statusChip = (status?: string) => {
    const value = status?.toLowerCase();
    if (value === "delivered") return "bg-green-100 text-green-700 border-green-200";
    if (value === "cancelled") return "bg-red-100 text-red-700 border-red-200";
    if (value === "confirmed" || value === "preparing") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const columns: Column<AdminOrder>[] = [
    {
      header: "Order #",
      accessor: "order_number",
      render: (row) => <span className="font-mono font-semibold">{row.order_number}</span>,
    },
    {
      header: "User",
      accessor: "user",
      render: (row) => (
        <span className="text-xs text-gray-600 font-mono truncate max-w-[120px] inline-block">
          {row.user}
        </span>
      ),
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
        <span className="text-gray-800 text-xs font-medium">
          {row.payment_method}{" "}
          <span className="text-gray-500">({row.payment_status})</span>
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "order_status",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border w-fit ${statusChip(
              row.order_status,
            )}`}
          >
            {row.order_status}
          </span>
          {row.delivery && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-full w-fit">
              <span>🛵 {row.delivery.delivery_status.replace(/_/g, " ")}</span>
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      align: "right",
      render: (row) => (
        <span className="text-gray-600 text-xs">
          {row.createdAt ? dayjs(row.createdAt).format("MMM D, YYYY") : "-"}
        </span>
      ),
    },
    {
      header: "Assign Delivery",
      accessor: "_id",
      align: "center",
      render: (row) => {
        const assignedName = row.delivery?.delivery_person?.name;
        return (
          <div className="flex flex-col items-center gap-1">
            {assignedName ? (
              <>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-full">
                  <span>Assigned: {assignedName}</span>
                </span>
                {row.order_status !== "delivered" && row.order_status !== "cancelled" && (
                  <button
                    onClick={() => handleOpenAssignModal(row)}
                    className="text-[10px] font-semibold text-brand underline hover:text-brand/80"
                  >
                    Re-assign
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => handleOpenAssignModal(row)}
                disabled={row.order_status === "cancelled" || row.order_status === "delivered"}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand/90 disabled:opacity-40 transition-all shadow-xs"
              >
                <FiTruck size={14} />
                <span>Assign</span>
              </button>
            )}
          </div>
        );
      },
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

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4 text-center text-brand">
          Orders & Delivery Assignment
        </h1>

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

      <AssignDeliveryModal
        open={assignModalOpen && !!assigningOrder}
        onClose={() => setAssignModalOpen(false)}
        orderNumber={assigningOrder?.order_number || ""}
        orderAmount={assigningOrder?.final_amount || 0}
        paymentMethod={assigningOrder?.payment_method || "COD"}
        deliveryStaff={deliveryStaffList}
        selectedStaffId={selectedStaffId}
        onSelectStaff={(id) => setSelectedStaffId(id)}
        onSubmit={handleAssignSubmit}
        loading={assignLoading}
      />
    </AdminLayout>
  );
};

export default Orders;

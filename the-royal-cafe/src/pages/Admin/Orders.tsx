import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import dayjs from "dayjs";
import { adminOrdersList, updatePaymentStatusService, cancelOrderService } from "@/services/orderService";
import { deliveryPersonList } from "@/services/deliveryPersonsService";
import { assignDeliveryService } from "@/services/deliveryService";
import { toastSuccess, toastError } from "@/utils/toast";
import Pagination from "@/components/Admin/common/Pagination";
import Filter from "@/components/Admin/common/Filter";
import AssignDeliveryModal from "@/components/Admin/modals/AssignDeliveryModal";
import CancelOrderModal from "@/components/orders/CancelOrderModal";
import { FiTruck, FiXCircle } from "react-icons/fi";

type AdminOrder = {
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
  final_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
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
      new Intl.NumberFormat("en-IN", {
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

  /* Modal state for cancelling order */
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState<AdminOrder | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelOrder = async (reason: string) => {
    if (!selectedCancelOrder) return;
    try {
      setCancelling(true);
      const res = await cancelOrderService(selectedCancelOrder._id, reason);
      toastSuccess(res.message || "Order cancelled successfully");
      setCancelModalOpen(false);
      setSelectedCancelOrder(null);
      fetchOrders();
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

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

    const handleAdminUpdate = () => {
      fetchOrders(filters);
    };

    window.addEventListener("adminOrderUpdated", handleAdminUpdate);
    return () => {
      window.removeEventListener("adminOrderUpdated", handleAdminUpdate);
    };
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

  const handleMarkPaid = async (orderId: string) => {
    try {
      await updatePaymentStatusService(orderId, "paid");
      toastSuccess("Payment status updated to Paid!");
      fetchOrders();
    } catch (err: unknown) {
      toastError(
        err instanceof Error ? err.message : "Failed to update payment status",
      );
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
      header: "Customer",
      accessor: "user",
      render: (row) => {
        if (typeof row.user === "object" && row.user !== null) {
          const name =
            `${row.user.first_name || ""} ${row.user.last_name || ""}`.trim() ||
            row.user.username ||
            "Customer";
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 text-xs truncate max-w-[130px]">
                {name}
              </span>
              {row.user.email && (
                <span className="text-[11px] text-gray-500 font-mono truncate max-w-[130px]">
                  {row.user.email}
                </span>
              )}
            </div>
          );
        }
        return (
          <span className="text-xs text-gray-600 font-mono truncate max-w-[120px] inline-block">
            {String(row.user || "-")}
          </span>
        );
      },
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
        <div className="flex flex-col gap-1 items-start">
          <span className="text-gray-900 text-xs font-semibold">
            {row.payment_method}{" "}
            <span
              className={
                row.payment_status === "paid"
                  ? "text-emerald-700 font-bold"
                  : row.payment_status === "refunded" || row.payment_status === "cancelled"
                  ? "text-red-700 font-bold"
                  : "text-amber-700 font-medium"
              }
            >
              ({row.payment_status})
            </span>
          </span>
          {row.razorpay_payment_id && (
            <span className="text-[10px] font-mono text-brand bg-brand/5 px-1.5 py-0.5 rounded border border-brand/20 w-fit">
              Razorpay: {row.razorpay_payment_id}
            </span>
          )}
          {row.payment_status !== "paid" && row.order_status !== "cancelled" && (
            <button
              onClick={() => handleMarkPaid(row._id)}
              className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2 py-0.5 rounded transition shadow-2xs mt-0.5"
            >
              ✓ Mark Paid
            </button>
          )}
        </div>
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
    {
      header: "Action",
      accessor: "_id",
      align: "center",
      render: (row) => (
        <div>
          {row.order_status !== "cancelled" && row.order_status !== "delivered" ? (
            <button
              onClick={() => {
                setSelectedCancelOrder(row);
                setCancelModalOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-all shadow-2xs"
            >
              <FiXCircle size={13} />
              <span>Cancel</span>
            </button>
          ) : (
            <span className="text-[11px] text-gray-400 font-medium">N/A</span>
          )}
        </div>
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
          { label: "Razorpay", value: "RAZORPAY" },
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

      <CancelOrderModal
        open={cancelModalOpen}
        orderNumber={selectedCancelOrder?.order_number}
        loading={cancelling}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedCancelOrder(null);
        }}
        onConfirm={handleCancelOrder}
      />
    </AdminLayout>
  );
};

export default Orders;

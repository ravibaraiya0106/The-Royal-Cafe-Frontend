import { useCallback, useEffect, useState } from "react";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import AdminLayout from "@/Layouts/AdminLayout";
import AddButton from "../../components/Admin/common/AddButton";
import AddEditCouponModal from "../../components/Admin/modals/AddEditCouponModal";
import {
  couponsList,
  deleteCoupon,
  createCoupon,
  updateCoupon,
  getCouponById,
} from "@/services/couponsService";
import { toastSuccess, toastError } from "@/utils/toast";
import ConfirmDialog from "../../components/Admin/modals/ConfirmDialog";
import Filter from "@/components/Admin/common/Filter";
import ShowDetailsModal from "@/components/Admin/modals/ShowDetailsModal";
import Pagination from "@/components/Admin/common/Pagination";
import dayjs from "dayjs";

type Coupon = {
  _id: string;
  code: string;
  description: string;
  discount_type: "percentage" | "flat";
  discount_value: number;
  min_order_amount: number;
  max_discount: number;
  expiry_date: string;
  usage_limit: number;
  used_count: number;
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select" | "date";
  options?: { label: string; value: string }[];
};

const Coupons = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Coupon | null>(null);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Coupon | null>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    code: "",
    discount_type: "",
    expiry_date: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  /* ================= FETCH ITEMS ================= */
  const fetchCoupons = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);

        const res = await couponsList(params);

        setCoupons(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          totalItems: res.total,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toastError("Failed to fetch coupons");
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  useEffect(() => {
    fetchCoupons(filters);
  }, [fetchCoupons, filters]);

  const defaultFilters = {
    page: 1,
    limit: 8,
    code: "",
    discount_type: "",
    expiry_date: "",
  };
  /* ================= FILTER ================= */
  const handleFilterChange = (values: Record<string, unknown>) => {
    // if reset
    if (Object.keys(values).length === 0) {
      setFilters(defaultFilters);
      return;
    }

    // normal filter
    setFilters((prev) => ({
      ...prev,
      ...values,
      page: 1,
    }));
  };

  /* ================= VIEW ================= */
  const handleView = (item: Coupon) => {
    setViewData(item);
    setViewOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = async (id: string) => {
    try {
      setOpen(true);
      setEditLoading(true);

      const data = await getCouponById(id);
      setEditData(data);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to fetch coupon");
      setOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      setDeleteLoading(true);

      const message = await deleteCoupon(selectedId);

      toastSuccess(message || "Coupon deleted successfully");

      setDeleteOpen(false);
      setSelectedId(null);

      fetchCoupons(filters);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= FILTER FIELDS ================= */
  const filterFields: FilterField[] = [
    { key: "code", label: "Search Code", type: "text" },
    {
      key: "discount_type",
      label: "Discount Type",
      type: "select",
      options: [
        { label: "Percentage", value: "percentage" },
        { label: "Flat", value: "flat" },
      ],
    },
    { key: "expiry_date", label: "Expiry Date", type: "date" },
  ];

  /* ================= TABLE ================= */
  const columns: Column<Coupon>[] = [
    { header: "Code", accessor: "code" },
    {
      header: "Description",
      accessor: "description",
      render: (row) => (
        <span>
          {row.description.length > 70
            ? row.description.slice(0, 70) + "..."
            : row.description}
        </span>
      ),
    },
    { header: "Discount Type", accessor: "discount_type" },
    { header: "Discount Value", accessor: "discount_value" },
    {
      header: "Expiry Date",
      accessor: "expiry_date",
      render: (row) => (
        <span>
          {row.expiry_date ? dayjs(row.expiry_date).format("DD MMM YYYY") : "-"}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "_id",
      render: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleView(row)} className="text-blue-500">
            <FiEye size={18} />
          </button>

          <button
            onClick={() => handleEdit(row._id)}
            disabled={editLoading}
            className="text-fg-brand disabled:opacity-50"
          >
            <FiEdit size={18} />
          </button>

          <button
            onClick={() => {
              setSelectedId(row._id);
              setDeleteOpen(true);
            }}
            className="text-red-500"
          >
            <FiTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4 text-center text-brand">
          Items
        </h1>

        <Filter filters={filterFields} onChange={handleFilterChange} />

        <Table columns={columns} data={coupons} loading={loading} />
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          limit={filters.limit}
          onPageChange={handlePageChange}
        />
        <AddButton
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
        />

        <AddEditCouponModal
          open={open}
          onClose={() => setOpen(false)}
          initialData={
            editData
              ? {
                  ...editData,
                }
              : undefined
          }
          onSubmit={async (formData: FormData) => {
            try {
              if (editData) {
                const message = await updateCoupon(editData._id, formData);
                toastSuccess(message || "Coupon updated");
              } else {
                const message = await createCoupon(formData);
                toastSuccess(message || "Coupon created");
              }

              setOpen(false);
              fetchCoupons(filters);
            } catch (err: unknown) {
              toastError(
                err instanceof Error ? err.message : "Something went wrong",
              );
            }
          }}
        />
      </div>

      <ConfirmDialog
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ShowDetailsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Item Details"
        fields={[
          { label: "Code", value: viewData?.code },
          { label: "Description", value: viewData?.description },
          { label: "Discount Type", value: viewData?.discount_type },
          { label: "Discount Value", value: viewData?.discount_value },
          { label: "Min Order Amount", value: viewData?.min_order_amount },
          { label: "Max Discount", value: viewData?.max_discount },
          { label: "Expiry Date", value: viewData?.expiry_date },
          { label: "Usage Limit", value: viewData?.usage_limit },
          { label: "Used Count", value: viewData?.used_count },
        ]}
      />
    </AdminLayout>
  );
};

export default Coupons;

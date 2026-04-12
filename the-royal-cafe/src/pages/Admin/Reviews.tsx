import { useCallback, useEffect, useState } from "react";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import { FiTrash, FiEye, FiStar } from "react-icons/fi";
import AdminLayout from "@/Layouts/AdminLayout";
import { reviewsList, deleteReview } from "@/services/reviewsService";
import { toastSuccess, toastError } from "@/utils/toast";
import ConfirmDialog from "../../components/Admin/modals/ConfirmDialog";
import Filter from "@/components/Admin/common/Filter";
import ShowDetailsModal from "@/components/Admin/modals/ShowDetailsModal";
import Pagination from "@/components/Admin/common/Pagination";

type Review = {
  _id: string;
  user: {
    username: string;
    email?: string;
  };
  product: {
    name: string;
  };
  rating?: number;
  comment: string;
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { label: string; value: string }[];
};

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Review | null>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    username: "",
    product: "",
    rating: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  /* ================= FETCH ITEMS ================= */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchReviews = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);

        const res = await reviewsList(params);

        setReviews(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          totalItems: res.total,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toastError("Failed to fetch reviews");
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
    fetchReviews(filters);
  }, [fetchReviews, filters]);

  const defaultFilters = {
    page: 1,
    limit: 10,
    username: "",
    email: "",
    product: "",
    rating: "",
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
  const handleView = (category: Review) => {
    setViewData(category);
    setViewOpen(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      setDeleteLoading(true);

      const message = await deleteReview(selectedId);

      toastSuccess(message || "Review deleted successfully");

      setDeleteOpen(false);
      setSelectedId(null);

      fetchReviews(filters);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };
  const getRatingUI = (rating?: number) => {
    if (!rating) return "-";

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={14}
            className={
              star <= rating
                ? "text-yellow-500 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating})</span>
      </div>
    );
  };
  /* ================= FILTER FIELDS ================= */
  const filterFields: FilterField[] = [
    { key: "username", label: "Search Username", type: "text" },
    { key: "product", label: "Search Product", type: "text" },
    {
      key: "rating",
      label: "Select Rating Star",
      type: "select",
      options: [
        { label: "1 Star", value: "1" },
        { label: "2 Stars", value: "2" },
        { label: "3 Stars", value: "3" },
        { label: "4 Stars", value: "4" },
        { label: "5 Stars", value: "5" },
      ],
    },
  ];

  /* ================= TABLE ================= */
  const columns: Column<Review>[] = [
    {
      header: "Username",
      accessor: "user",
      render: (row) => row.user?.username || "-",
    },
    {
      header: "Product",
      accessor: "product",
      render: (row) => row.product?.name || "-",
    },
    {
      header: "Rating",
      accessor: "rating",
      render: (row) => getRatingUI(row.rating),
    },
    { header: "Comment", accessor: "comment" },

    {
      header: "Action",
      accessor: "_id",
      render: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleView(row)} className="text-blue-500">
            <FiEye size={18} />
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
          Reviews
        </h1>

        <Filter filters={filterFields} onChange={handleFilterChange} />

        <Table columns={columns} data={reviews} loading={loading} />
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          limit={filters.limit}
          totalItems={pagination.totalItems}
          onPageChange={handlePageChange}
        />
      </div>

      <ConfirmDialog
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ShowDetailsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Review Details"
        fields={[
          { label: "Username", value: viewData?.user?.username },
          { label: "Product", value: viewData?.product?.name },
          {
            label: "Rating",
            render: () => getRatingUI(viewData?.rating),
          },
          { label: "Comment", value: viewData?.comment },
        ]}
      />
    </AdminLayout>
  );
};

export default Reviews;

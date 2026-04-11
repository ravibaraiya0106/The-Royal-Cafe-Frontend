import { useCallback, useEffect, useState } from "react";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import AdminLayout from "@/Layouts/AdminLayout";
import AddButton from "../../components/Admin/common/AddButton";
import AddEditCategoryModal from "../../components/Admin/modals/AddEditCategoryModal";
import {
  categoriesList,
  deleteCategory,
  createCategory,
  updateCategory,
  getCategoryById,
} from "@/services/categoriesService";
import { toastSuccess, toastError } from "@/utils/toast";
import ConfirmDialog from "../../components/Admin/modals/ConfirmDialog";
import Filter from "@/components/Admin/common/Filter";
import ShowDetailsModal from "@/components/Admin/modals/ShowDetailsModal";
import Pagination from "@/components/Admin/common/Pagination";

type Category = {
  _id: string;
  name: string;
  description: string;
  image?: string;
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { label: string; value: string }[];
};

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Category | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Category | null>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    name: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  /* ================= FETCH ITEMS ================= */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCategories = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);

        const res = await categoriesList(params);

        setCategories(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toastError("Failed to fetch categories");
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
    fetchCategories(filters);
  }, [fetchCategories, filters]);

  const defaultFilters = {
    page: 1,
    limit: 5,
    name: "",
    category: "",
    is_special: "",
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
  const handleView = (category: Category) => {
    setViewData(category);
    setViewOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = async (id: string) => {
    try {
      setOpen(true);
      setEditLoading(true);

      const data = await getCategoryById(id);
      setEditData(data);
    } catch (err: unknown) {
      toastError(
        err instanceof Error ? err.message : "Failed to fetch category",
      );
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

      const message = await deleteCategory(selectedId);

      toastSuccess(message || "Category deleted successfully");

      setDeleteOpen(false);
      setSelectedId(null);

      fetchCategories(filters);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= FILTER FIELDS ================= */
  const filterFields: FilterField[] = [
    { key: "name", label: "Search Name", type: "text" },
  ];

  /* ================= TABLE ================= */
  const columns: Column<Category>[] = [
    { header: "Name", accessor: "name" },
    {
      header: "Description",
      accessor: "description",
      render: (row) =>
        row.description.length > 70
          ? row.description.slice(0, 70) + "..."
          : row.description,
    },
    {
      header: "Image",
      accessor: "image",
      render: (row) =>
        row.image ? (
          <img
            src={`${import.meta.env.VITE_FILE_URL}${row.image}`}
            alt="Category"
            className="w-12 h-12 object-cover rounded-lg border"
          />
        ) : (
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg text-xs text-gray-400">
            No Img
          </div>
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
          Categories
        </h1>

        <Filter filters={filterFields} onChange={handleFilterChange} />

        <Table columns={columns} data={categories} loading={loading} />
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
        <AddButton
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
        />

        <AddEditCategoryModal
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
                const message = await updateCategory(editData._id, formData);
                toastSuccess(message || "Category updated");
              } else {
                const message = await createCategory(formData);
                toastSuccess(message || "Category created");
              }

              setOpen(false);
              fetchCategories(filters);
            } catch (err: unknown) {
              toastError(
                err instanceof Error ? err.message : "Something went wrong",
              );
            }
          }}
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
        title="Category Details"
        image={
          viewData?.image
            ? `${import.meta.env.VITE_FILE_URL}${viewData.image}`
            : null
        }
        fields={[
          { label: "Name", value: viewData?.name },
          { label: "Description", value: viewData?.description },
        ]}
      />
    </AdminLayout>
  );
};

export default Categories;

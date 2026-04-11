import { useCallback, useEffect, useState } from "react";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import { FiEdit, FiTrash, FiEye, FiAward } from "react-icons/fi";
import AdminLayout from "@/Layouts/AdminLayout";
import AddButton from "../../components/Admin/common/AddButton";
import AddEditItemModal from "../../components/Admin/modals/AddEditItemModal";
import {
  itemsList,
  deleteItem,
  createItem,
  updateItem,
  getItemById,
  getCategoryDropdown,
} from "@/services/itemsService";
import { toastSuccess, toastError } from "@/utils/toast";
import ConfirmDialog from "../../components/Admin/modals/ConfirmDialog";
import Filter from "@/components/Admin/common/Filter";
import ShowDetailsModal from "@/components/Admin/modals/ShowDetailsModal";
import Pagination from "@/components/Admin/common/Pagination";

type Item = {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: { _id: string; name?: string } | string;
  image?: string;
  is_special: boolean;
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { label: string; value: string }[];
};

const Items = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Item | null>(null);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Item | null>(null);

  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    name: "",
    category: "",
    is_special: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  /* ================= FETCH ITEMS ================= */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchItems = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);

        const res = await itemsList(params);

        setItems(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          totalItems: res.total,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toastError("Failed to fetch items");
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

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const res = await getCategoryDropdown();

      const options = res.map((cat: { name: string; _id: string }) => ({
        label: cat.name,
        value: cat._id,
      }));

      setCategories(options);
    } catch (err) {
      console.error(err);
      toastError("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems(filters);
  }, [fetchItems, filters]);

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
  const handleView = (item: Item) => {
    setViewData(item);
    setViewOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = async (id: string) => {
    try {
      setOpen(true);
      setEditLoading(true);

      const data = await getItemById(id);
      setEditData(data);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to fetch item");
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

      const message = await deleteItem(selectedId);

      toastSuccess(message || "Item deleted successfully");

      setDeleteOpen(false);
      setSelectedId(null);

      fetchItems(filters);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= FILTER FIELDS ================= */
  const filterFields: FilterField[] = [
    { key: "name", label: "Search Name", type: "text" },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: categories,
    },
    {
      key: "is_special",
      label: "Type",
      type: "select",
      options: [
        { label: "Special", value: "true" },
        { label: "Regular", value: "false" },
      ],
    },
  ];

  /* ================= TABLE ================= */
  const columns: Column<Item>[] = [
    { header: "Name", accessor: "name" },
    { header: "Price", accessor: "price" },
    {
      header: "Description",
      accessor: "description",
      render: (row) =>
        row.description.length > 70
          ? row.description.slice(0, 70) + "..."
          : row.description,
    },
    {
      header: "Category",
      accessor: "category",
      render: (row) =>
        typeof row.category === "string" ? row.category : row.category?.name,
    },
    {
      header: "Image",
      accessor: "image",
      render: (row) =>
        row.image ? (
          <img
            src={`${import.meta.env.VITE_FILE_URL}${row.image}`}
            alt="item"
            className="w-12 h-12 object-cover rounded-lg border"
          />
        ) : (
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg text-xs text-gray-400">
            No Img
          </div>
        ),
    },
    {
      header: "Special",
      accessor: "is_special",
      align: "center",
      render: (row) => (
        <div className="flex justify-center">
          <div
            className={`p-1.5 rounded-lg ${
              row.is_special
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <FiAward
              size={16}
              className={row.is_special ? "animate-pulse" : ""}
            />
          </div>
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
          Items
        </h1>

        <Filter filters={filterFields} onChange={handleFilterChange} />

        <Table columns={columns} data={items} loading={loading} />
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

        <AddEditItemModal
          open={open}
          onClose={() => setOpen(false)}
          initialData={
            editData
              ? {
                  ...editData,
                  category:
                    typeof editData.category === "string"
                      ? { _id: editData.category }
                      : { _id: editData.category._id },
                }
              : undefined
          }
          onSubmit={async (formData: FormData) => {
            try {
              if (editData) {
                const message = await updateItem(editData._id, formData);
                toastSuccess(message || "Item updated");
              } else {
                const message = await createItem(formData);
                toastSuccess(message || "Item created");
              }

              setOpen(false);
              fetchItems(filters);
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
        image={
          viewData?.image
            ? `${import.meta.env.VITE_FILE_URL}${viewData.image}`
            : null
        }
        fields={[
          { label: "Name", value: viewData?.name },
          { label: "Price", value: viewData?.price },
          {
            label: "Category",
            value:
              typeof viewData?.category === "string"
                ? viewData?.category
                : viewData?.category?.name,
          },
          { label: "Description", value: viewData?.description },
          {
            label: "Special",
            value: viewData?.is_special ? "Yes" : "No",
          },
        ]}
      />
    </AdminLayout>
  );
};

export default Items;

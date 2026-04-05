import { useEffect, useState } from "react";
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
} from "@/services/itemsService";
import { toastSuccess, toastError } from "@/utils/toast";
import ConfirmDialog from "../../components/Admin/modals/ConfirmDialog";
import Filter from "@/components/Admin/common/Filter";

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
  options?: { label: string; value: string | number }[];
};

const Items = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Item | null>(null);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false); // separate loading

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  const filterFields: FilterField[] = [
    { key: "name", label: "Search Name", type: "text" },

    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        ...new Map(
          items.map((item) => [
            typeof item.category === "string"
              ? item.category
              : item.category?._id,
            {
              label:
                typeof item.category === "string"
                  ? item.category
                  : item.category?.name || "",
              value:
                typeof item.category === "string"
                  ? item.category
                  : item.category?._id,
            },
          ]),
        ).values(),
      ],
    },

    {
      key: "is_special",
      label: "Special",
      type: "select",
      options: [
        { label: "Special", value: "true" },
        { label: "Regular", value: "false" },
      ],
    },
  ];
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    name: "",
    category: "",
    is_special: "",
  });
  const handleFilterChange = (values: Record<string, unknown>) => {
    let data = [...items];

    // NAME FILTER
    if (values.name) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(String(values.name).toLowerCase()),
      );
    }

    // CATEGORY FILTER
    if (values.category) {
      data = data.filter((item) => {
        const categoryId =
          typeof item.category === "string"
            ? item.category
            : item.category?._id;

        return categoryId === values.category;
      });
    }

    // SPECIAL FILTER
    if (values.is_special !== undefined && values.is_special !== "") {
      const isSpecial = values.is_special === "true";

      data = data.filter((item) => item.is_special === isSpecial);
    }

    setFilteredItems(data);
  };
  /* ================= FETCH ================= */
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (customFilters = filters) => {
    try {
      setLoading(true);

      const res = await itemsList(customFilters);

      setItems(res.data);
    } catch (err) {
      console.error(err);
      toastError("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };
  /* ================= EDIT ================= */
  const handleEdit = async (id: string) => {
    try {
      setOpen(true); // open immediately
      setEditLoading(true); // show loader inside modal

      const data = await getItemById(id);

      setEditData(data);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to fetch item");
      setOpen(false); // optional: close if failed
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

      fetchItems();
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= COLUMNS ================= */
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
          {/* VIEW (future use) */}
          <button className="text-blue-500">
            <FiEye size={18} />
          </button>

          {/* EDIT */}
          <button
            onClick={() => handleEdit(row._id)}
            disabled={editLoading}
            className="text-fg-brand disabled:opacity-50"
          >
            <FiEdit size={18} />
          </button>

          {/* DELETE */}
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
        <Table columns={columns} data={filteredItems} loading={loading} />

        {/* ADD BUTTON */}
        <AddButton
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
        />

        {/* MODAL */}
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
                      : { _id: editData.category._id }, // FIXED
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
              fetchItems();
            } catch (err: unknown) {
              toastError(
                err instanceof Error ? err.message : "Something went wrong",
              );
            }
          }}
        />
      </div>

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </AdminLayout>
  );
};

export default Items;

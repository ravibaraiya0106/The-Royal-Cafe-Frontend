import { useEffect, useState } from "react";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import {
  FiEdit,
  FiTrash,
  FiEye,
  FiAward,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import AdminLayout from "@/Layouts/AdminLayout";
import AddButton from "../../components/Admin/common/AddButton";
import AddEditItemModal from "./modals/AddEditItemModal";
import {
  itemsList,
  deleteItem,
  createItem,
  updateItem,
} from "@/services/itemsService";
import { toastSuccess, toastError } from "@/utils/toast";
import ConfirmDialog from "./modals/ConfirmDialog";

type Item = {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: { _id: string; name: string } | string;
  image?: string;
  is_special: boolean;
  is_active: boolean;
};

const Items = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Item | null>(null);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const categories = [
    { _id: "1", name: "Pizza" },
    { _id: "2", name: "Burger" },
  ];

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemsList();
      setItems(data);
    } catch (err) {
      console.error(err);
      toastError("Failed to fetch items");
    } finally {
      setLoading(false);
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
    { header: "Description", accessor: "description" },

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
      header: "Status",
      accessor: "is_active",
      render: (row) => (
        <div className="flex justify-center">
          {row.is_active ? (
            <div className="p-1.5 rounded-full bg-green-100 text-green-600">
              <FiCheckCircle size={14} />
            </div>
          ) : (
            <div className="p-1.5 rounded-full bg-red-100 text-red-600">
              <FiXCircle size={14} />
            </div>
          )}
        </div>
      ),
    },

    {
      header: "Action",
      accessor: "_id",
      render: (row) => (
        <div className="flex items-center gap-4">
          <button className="text-blue-500">
            <FiEye size={18} />
          </button>

          <button
            onClick={() => {
              setEditData(row);
              setOpen(true);
            }}
            className="text-fg-brand"
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

        <Table columns={columns} data={items} loading={loading} />

        <AddButton
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
        />

        <AddEditItemModal
          open={open}
          onClose={() => setOpen(false)}
          categories={categories}
          initialData={
            editData
              ? {
                  ...editData,
                  category:
                    typeof editData.category === "string"
                      ? { _id: editData.category }
                      : editData.category,
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

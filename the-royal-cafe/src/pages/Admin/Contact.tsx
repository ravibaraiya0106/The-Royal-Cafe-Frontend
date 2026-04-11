import { useCallback, useEffect, useState } from "react";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import { FiTrash, FiEye } from "react-icons/fi";
import AdminLayout from "@/Layouts/AdminLayout";
import { contactsList, deleteContact } from "@/services/contactService";
import { toastSuccess, toastError } from "@/utils/toast";
import ConfirmDialog from "../../components/Admin/modals/ConfirmDialog";
import Filter from "@/components/Admin/common/Filter";
import ShowDetailsModal from "@/components/Admin/modals/ShowDetailsModal";
import Pagination from "@/components/Admin/common/Pagination";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  replyMessage?: string;
  status?: string;
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { label: string; value: string }[];
};

const Contact = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Contact | null>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    name: "",
    email: "",
    phone: "",
    subject: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  /* ================= FETCH ITEMS ================= */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchContacts = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);

        const res = await contactsList(params);

        setContacts(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          totalItems: res.total,
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
    fetchContacts(filters);
  }, [fetchContacts, filters]);

  const defaultFilters = {
    page: 1,
    limit: 5,
    name: "",
    email: "",
    phone: "",
    subject: "",
    status: "",
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
  const handleView = (category: Contact) => {
    setViewData(category);
    setViewOpen(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      setDeleteLoading(true);

      const message = await deleteContact(selectedId);

      toastSuccess(message || "Contact deleted successfully");

      setDeleteOpen(false);
      setSelectedId(null);

      fetchContacts(filters);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= FILTER FIELDS ================= */
  const filterFields: FilterField[] = [
    { key: "name", label: "Search Name", type: "text" },
    { key: "email", label: "Search Email", type: "text" },
    { key: "phone", label: "Search Phone", type: "text" },
    { key: "subject", label: "Search Subject", type: "text" },
    {
      key: "status",
      label: "Select Status",
      type: "select",
      options: [
        { label: "Unread", value: "Unread" },
        { label: "Read", value: "Read" },
        { label: "Replied", value: "Replied" },
      ],
    },
  ];

  /* ================= TABLE ================= */
  const columns: Column<Contact>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Subject", accessor: "subject" },
    {
      header: "Message",
      accessor: "message",
      render: (row) =>
        row.message.length > 70
          ? row.message.slice(0, 70) + "..."
          : row.message,
    },
    {
      header: "Reply Message",
      accessor: "replyMessage",
      render: (row) =>
        row.replyMessage && row.replyMessage.length > 70
          ? row.replyMessage.slice(0, 70) + "..."
          : row.replyMessage || "",
    },
    { header: "Status", accessor: "status" },

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
          Categories
        </h1>

        <Filter filters={filterFields} onChange={handleFilterChange} />

        <Table columns={columns} data={contacts} loading={loading} />
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
        title="Contact Details"
        fields={[
          { label: "Name", value: viewData?.name },
          { label: "Email", value: viewData?.email },
          { label: "Phone", value: viewData?.phone },
          { label: "Subject", value: viewData?.subject },
          { label: "Message", value: viewData?.message },
          { label: "Reply Message", value: viewData?.replyMessage },
          { label: "Status", value: viewData?.status },
        ]}
      />
    </AdminLayout>
  );
};

export default Contact;

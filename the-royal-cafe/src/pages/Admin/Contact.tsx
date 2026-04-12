import { useCallback, useEffect, useState } from "react";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import { FiTrash, FiEye, FiMail, FiCheckCircle } from "react-icons/fi";
import AdminLayout from "@/Layouts/AdminLayout";
import {
  contactsList,
  deleteContact,
  getContactById,
  replyContact,
} from "@/services/contactsService";
import { toastSuccess, toastError } from "@/utils/toast";
import ConfirmDialog from "../../components/Admin/modals/ConfirmDialog";
import Filter from "@/components/Admin/common/Filter";
import ShowDetailsModal from "@/components/Admin/modals/ShowDetailsModal";
import Pagination from "@/components/Admin/common/Pagination";
import { PrimaryButton } from "@/components/common/form/Button";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  reply_message?: string;
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
  const [viewLoading, setViewLoading] = useState(false);

  const [reply_message, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

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
  const handleReplySubmit = async () => {
    if (!viewData?._id) return;

    if (!reply_message.trim()) {
      toastError("Reply message is required");
      return;
    }

    try {
      setReplyLoading(true);

      /* ================= FORM DATA ================= */
      const formData = new FormData();
      formData.append("reply_message", reply_message);

      /* ================= API CALL ================= */
      const message = await replyContact(viewData._id, formData);

      toastSuccess(message || "Reply sent successfully");

      /* ================= UPDATE UI ================= */
      setViewData((prev) =>
        prev
          ? {
              ...prev,
              reply_message,
              status: "Replied",
            }
          : prev,
      );

      /* ================= REFRESH TABLE ================= */
      fetchContacts(filters);
      handleCloseModal();
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Reply failed");
    } finally {
      setReplyLoading(false);
    }
  };
  const handleCloseModal = () => {
    setViewOpen(false);

    //  refresh latest data
    fetchContacts(filters);
  };
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  useEffect(() => {
    fetchContacts(filters);
  }, [fetchContacts, filters]);
  const getStatusUI = (status?: string) => {
    const value = status?.toLowerCase();

    let icon;
    let style = "";

    if (value === "unread") {
      icon = <FiMail size={14} />;
      style = "bg-gray-100 text-gray-600";
    } else if (value === "read") {
      icon = <FiEye size={14} />;
      style = "bg-yellow-100 text-yellow-700";
    } else if (value === "replied") {
      icon = <FiCheckCircle size={14} />;
      style = "bg-green-100 text-green-700";
    }

    return (
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit ${style}`}
      >
        {icon}
        <span className="capitalize">{status || "Unread"}</span>
      </div>
    );
  };
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
  const handleView = async (row: Contact) => {
    try {
      setViewOpen(true);
      setViewLoading(true);

      const data = await getContactById(row._id);

      setViewData(data);
      setReplyMessage(data.reply_message || ""); //  preload
    } catch (err: unknown) {
      toastError(
        err instanceof Error ? err.message : "Failed to fetch contact",
      );
      handleCloseModal();
    } finally {
      setViewLoading(false);
    }
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
      accessor: "reply_message",
      render: (row) =>
        row.reply_message && row.reply_message.length > 70
          ? row.reply_message.slice(0, 70) + "..."
          : row.reply_message || "",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => getStatusUI(row.status),
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
          Contact Messages
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
        onClose={handleCloseModal}
        title="Contact Details"
        fields={
          viewLoading
            ? [{ label: "Loading...", value: "Please wait..." }]
            : [
                { label: "Name", value: viewData?.name },
                { label: "Email", value: viewData?.email },
                { label: "Phone", value: viewData?.phone },
                { label: "Subject", value: viewData?.subject },
                { label: "Message", value: viewData?.message },

                /*  CUSTOM REPLY FIELD */
                {
                  label: "Reply",
                  render: () => (
                    <div className="space-y-3">
                      <textarea
                        className="w-full border rounded-[5px] p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#6b0f0f]"
                        rows={4}
                        placeholder="Write your reply..."
                        value={reply_message}
                        onChange={(e) => setReplyMessage(e.target.value)}
                      />

                      <div className="flex justify-end">
                        <PrimaryButton
                          label="Send Reply"
                          onClick={handleReplySubmit}
                          loading={replyLoading}
                        />
                      </div>
                    </div>
                  ),
                },

                {
                  label: "Status",
                  render: () => getStatusUI(viewData?.status),
                },
              ]
        }
      />
    </AdminLayout>
  );
};

export default Contact;

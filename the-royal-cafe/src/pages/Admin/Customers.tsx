import { useCallback, useEffect, useState } from "react";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import { FiTrash, FiEye } from "react-icons/fi";
import AdminLayout from "@/Layouts/AdminLayout";
import { customersList, deleteCustomer } from "@/services/customersService";
import { toastSuccess, toastError } from "@/utils/toast";
import ConfirmDialog from "../../components/Admin/modals/ConfirmDialog";
import Filter from "@/components/Admin/common/Filter";
import ShowDetailsModal from "@/components/Admin/modals/ShowDetailsModal";
import Pagination from "@/components/Admin/common/Pagination";

type Customer = {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  gender?: string;
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { label: string; value: string }[];
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Customer | null>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    email: "",
    first_name: "",
    last_name: "",
    phone_no: "",
    username: "",
    gender: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  /* ================= FETCH ITEMS ================= */

  const fetchCustomers = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);

        const res = await customersList(params);

        setCustomers(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          totalItems: res.total,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toastError("Failed to fetch customers");
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
    fetchCustomers(filters);
  }, [fetchCustomers, filters]);

  const defaultFilters = {
    page: 1,
    limit: 8,
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    gender: "",
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
  const handleView = (customer: Customer) => {
    setViewData(customer);
    setViewOpen(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      setDeleteLoading(true);

      const message = await deleteCustomer(selectedId);

      toastSuccess(message || "Customer deleted successfully");

      setDeleteOpen(false);
      setSelectedId(null);

      fetchCustomers(filters);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= FILTER FIELDS ================= */
  const filterFields: FilterField[] = [
    { key: "username", label: "Search Username", type: "text" },
    { key: "first_name", label: "Search First Name", type: "text" },
    { key: "last_name", label: "Search Last Name", type: "text" },
    { key: "email", label: "Search Email", type: "text" },
    { key: "phone_no", label: "Search Phone", type: "text" },
    {
      key: "gender",
      label: "Select Gender",
      type: "select",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ],
    },
  ];

  /* ================= TABLE ================= */
  const columns: Column<Customer>[] = [
    { header: "Username", accessor: "username" },
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone_no" },
    { header: "Gender", accessor: "gender" },
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
          Customers
        </h1>

        <Filter filters={filterFields} onChange={handleFilterChange} />

        <Table columns={columns} data={customers} loading={loading} />
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          limit={filters.limit}
          totalItems={pagination.totalItems}
          onPageChange={handlePageChange}
        />
      </div>

      <ConfirmDialog
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ShowDetailsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Customer Details"
        fields={[
          { label: "Username", value: viewData?.username },
          { label: "First Name", value: viewData?.first_name },
          { label: "Last Name", value: viewData?.last_name },
          { label: "Email", value: viewData?.email },
          { label: "Phone", value: viewData?.phone_no },
        ]}
      />
    </AdminLayout>
  );
};

export default Customers;

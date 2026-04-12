import { useCallback, useEffect, useState } from "react";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { FaMotorcycle, FaBicycle } from "react-icons/fa";
import { MdElectricScooter } from "react-icons/md";
import AdminLayout from "@/Layouts/AdminLayout";
import AddButton from "../../components/Admin/common/AddButton";
import AddEditDeliveryPersonModal from "../../components/Admin/modals/AddEditDeliveryPersonModal";
import {
  deleteDeliveryPerson,
  deliveryPersonList,
  updateDeliveryPerson,
  createDeliveryPerson,
  getDeliveryPersonById,
} from "@/services/deliveryPersonsService";
import { toastSuccess, toastError } from "@/utils/toast";
import ConfirmDialog from "../../components/Admin/modals/ConfirmDialog";
import Filter from "@/components/Admin/common/Filter";
import ShowDetailsModal from "@/components/Admin/modals/ShowDetailsModal";
import Pagination from "@/components/Admin/common/Pagination";

type DeliveryPerson = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_type: string;
  vehicle_number: string;
  current_location: {
    lat: number;
    lng: number;
  };
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { label: string; value: string }[];
};

const DeliveryPerson = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<DeliveryPerson | null>(null);

  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<DeliveryPerson | null>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    name: "",
    phone: "",
    vehicle_type: "",
    vehicle_number: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  /* ================= FETCH ITEMS ================= */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDeliveryPersons = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);

        const res = await deliveryPersonList(params);

        setDeliveryPersons(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          totalItems: res.total,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toastError("Failed to fetch delivery persons");
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
    fetchDeliveryPersons(filters);
  }, [fetchDeliveryPersons, filters]);

  const defaultFilters = {
    page: 1,
    limit: 5,
    name: "",
    phone: "",
    vehicle_type: "",
    vehicle_number: "",
  };
  const getVehicleUI = (type?: string) => {
    const value = type?.toLowerCase();

    let icon;
    let style = "";

    if (value === "bike") {
      icon = <FaMotorcycle size={14} />;
      style = "bg-blue-100 text-blue-700";
    } else if (value === "cycle") {
      icon = <FaBicycle size={14} />;
      style = "bg-green-100 text-green-700";
    } else if (value === "scooter") {
      icon = <MdElectricScooter size={14} />; // fallback (you can change later)
      style = "bg-purple-100 text-purple-700";
    }

    return (
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit ${style}`}
      >
        {icon}
        <span className="capitalize">{type || "-"}</span>
      </div>
    );
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
  const handleView = (item: DeliveryPerson) => {
    setViewData(item);
    setViewOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = async (id: string) => {
    try {
      setOpen(true);
      setEditLoading(true);

      const data = await getDeliveryPersonById(id);
      setEditData(data);
    } catch (err: unknown) {
      toastError(
        err instanceof Error ? err.message : "Failed to fetch delivery person",
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

      const message = await deleteDeliveryPerson(selectedId);

      toastSuccess(message || "Delivery person deleted successfully");

      setDeleteOpen(false);
      setSelectedId(null);

      fetchDeliveryPersons(filters);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= FILTER FIELDS ================= */
  const filterFields: FilterField[] = [
    { key: "name", label: "Search Name", type: "text" },
    { key: "phone", label: "Search Phone", type: "text" },
    {
      key: "vehicle_type",
      label: "Select Vehicle Type",
      type: "select",
      options: [
        { label: "Bike", value: "Bike" },
        { label: "Cycle", value: "Cycle" },
        { label: "Scooter", value: "Scooter" },
      ],
    },
    { key: "vehicle_number", label: "Search Vehicle Number", type: "text" },
  ];

  /* ================= TABLE ================= */
  const columns: Column<DeliveryPerson>[] = [
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Email", accessor: "email" },
    {
      header: "Vehicle Type",
      accessor: "vehicle_type",
      render: (row) => getVehicleUI(row.vehicle_type),
    },
    { header: "Vehicle Number", accessor: "vehicle_number" },
    {
      header: "Location",
      accessor: "current_location",
      render: (row) => (
        <div className="flex items-center gap-4">
          {row.current_location
            ? `${row.current_location.lat}, ${row.current_location.lng}`
            : "-"}
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
          Delivery Person
        </h1>

        <Filter filters={filterFields} onChange={handleFilterChange} />

        <Table columns={columns} data={deliveryPersons} loading={loading} />
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

        <AddEditDeliveryPersonModal
          open={open}
          onClose={() => setOpen(false)}
          initialData={editData ? { ...editData } : undefined}
          onSubmit={async (formData: FormData) => {
            try {
              if (editData) {
                const message = await updateDeliveryPerson(
                  editData._id,
                  formData,
                );
                toastSuccess(message || "Delivery person updated");
              } else {
                const message = await createDeliveryPerson(formData);
                toastSuccess(message || "Delivery person created");
              }
              setOpen(false);
              fetchDeliveryPersons(filters);
            } catch (err: unknown) {
              toastError(
                err instanceof Error ? err.message : "Something went wrong",
              );
            }
          }}
        />
      </div>

      <ConfirmDialog
        title="Delete Delivery Person"
        message="Are you sure you want to delete this delivery person?"
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ShowDetailsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Delivery Person Details"
        fields={[
          { label: "Name", value: viewData?.name },
          { label: "Phone", value: viewData?.phone },
          { label: "Email", value: viewData?.email },
          {
            label: "Vehicle Type",
            render: () => getVehicleUI(viewData?.vehicle_type),
          },
          { label: "Vehicle Number", value: viewData?.vehicle_number },
          {
            label: "Location",
            value: `${viewData?.current_location?.lat}, ${viewData?.current_location?.lng}`,
          },
        ]}
      />
    </AdminLayout>
  );
};

export default DeliveryPerson;

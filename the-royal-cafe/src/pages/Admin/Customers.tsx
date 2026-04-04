import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import AdminLayout from "@/Layouts/AdminLayout";

type Customer = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const Customers = () => {
  const data: Customer[] = [
    { id: 1, name: "Ravi", email: "ravi@gmail.com", role: "Admin" },
    { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
    { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
    { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
    { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
    { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
    { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
    { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
    { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
    { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
    { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
    { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
  ];

  const columns: Column<Customer>[] = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    {
      header: "Action",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-4">
          {/* View */}
          <button
            onClick={() => console.log("View", row)}
            className="text-blue-500 hover:text-blue-600"
          >
            <FiEye size={18} />
          </button>

          {/* Edit */}
          <button
            onClick={() => console.log("Edit", row)}
            className="text-fg-brand hover:text-fg-brand/80"
          >
            <FiEdit size={18} />
          </button>

          {/* Delete */}
          <button
            onClick={() => console.log("Delete", row)}
            className="text-red-500 hover:text-red-600"
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
        <h1 className="text-xl font-semibold mb-4 text-center text-brand">Customers</h1>

        <Table<Customer> columns={columns} data={data} />
      </div>
    </AdminLayout>
  );
};

export default Customers;

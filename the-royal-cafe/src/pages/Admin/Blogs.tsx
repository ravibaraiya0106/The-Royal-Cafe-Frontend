import { useCallback, useEffect, useState } from "react";
import Table from "../../components/Admin/common/table";
import type { Column } from "../../components/Admin/common/table";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import AdminLayout from "@/Layouts/AdminLayout";
import AddButton from "../../components/Admin/common/AddButton";
import AddEditBlogModal from "../../components/Admin/modals/AddEditBlogModal";
import {
  blogList,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/services/blogsService";
import { toastSuccess, toastError } from "@/utils/toast";
import ConfirmDialog from "../../components/Admin/modals/ConfirmDialog";
import Filter from "@/components/Admin/common/Filter";
import ShowDetailsModal from "@/components/Admin/modals/ShowDetailsModal";
import Pagination from "@/components/Admin/common/Pagination";

type Blog = {
  _id: string;
  title: string;
  content: string;
  image: string;
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { label: string; value: string }[];
};

const Blogs = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Blog | null>(null);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Blog | null>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    title: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  /* ================= FETCH ITEMS ================= */
  const fetchBlogs = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);

        const res = await blogList(params);

        setBlogs(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          totalItems: res.total,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toastError("Failed to fetch blogs");
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
    fetchBlogs(filters);
  }, [fetchBlogs, filters]);

  const defaultFilters = {
    page: 1,
    limit: 5,
    title: "",
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
  const handleView = (item: Blog) => {
    setViewData(item);
    setViewOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = async (id: string) => {
    try {
      setOpen(true);
      setEditLoading(true);

      const data = await getBlogById(id);
      setEditData(data);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to fetch blog");
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

      const message = await deleteBlog(selectedId);

      toastSuccess(message || "Blog deleted successfully");

      setDeleteOpen(false);
      setSelectedId(null);

      fetchBlogs(filters);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= FILTER FIELDS ================= */
  const filterFields: FilterField[] = [
    { key: "title", label: "Search Title", type: "text" },
  ];

  /* ================= TABLE ================= */
  const columns: Column<Blog>[] = [
    { header: "Title", accessor: "title" },
    {
      header: "Content",
      accessor: "content",
      render: (row) => {
        const text = row.content || "";

        return text.length > 80 ? text.substring(0, 80) + "..." : text;
      },
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
          Blogs
        </h1>

        <Filter filters={filterFields} onChange={handleFilterChange} />

        <Table columns={columns} data={blogs} loading={loading} />
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

        <AddEditBlogModal
          open={open}
          onClose={() => setOpen(false)}
          initialData={editData || undefined}
          onSubmit={async (formData: FormData) => {
            try {
              if (editData) {
                const message = await updateBlog(editData._id, formData);
                toastSuccess(message || "Blog updated");
              } else {
                const message = await createBlog(formData);
                toastSuccess(message || "Blog created");
              }
              setOpen(false);
              fetchBlogs(filters);
            } catch (err: unknown) {
              toastError(
                err instanceof Error ? err.message : "Something went wrong",
              );
            }
          }}
        />
      </div>

      <ConfirmDialog
        title="Delete Blog"
        message="Are you sure you want to delete this blog?"
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ShowDetailsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Blog Details"
        image={
          viewData?.image
            ? `${import.meta.env.VITE_FILE_URL}${viewData.image}`
            : null
        }
        fields={[
          { label: "Title", value: viewData?.title },
          { label: "Content", value: viewData?.content },
        ]}
      />
    </AdminLayout>
  );
};

export default Blogs;

import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import ItemCard from "@/components/items/ItemCard";
import Filter from "@/components/Admin/common/Filter";
import Pagination from "@/components/Admin/common/Pagination";
import { itemsList, getCategoryDropdown } from "@/services/itemsService";

type Item = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  is_special?: boolean;
  category?: { _id: string; name: string } | string;
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { label: string; value: string }[];
};

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
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
  const fetchItems = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);

        const res = await itemsList(params);

        setItems(res.data || []);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          totalItems: res.total,
        });
      } catch (err) {
        console.error("Failed to fetch items", err);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const res = await getCategoryDropdown();

      const options = res.map((cat: { _id: string; name: string }) => ({
        label: cat.name,
        value: cat._id,
      }));

      setCategories(options);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems(filters);
  }, [fetchItems, filters]);

  /* ================= FILTER ================= */
  const handleFilterChange = (values: Record<string, unknown>) => {
    if (Object.keys(values).length === 0) {
      setFilters({
        page: 1,
        limit: 10,
        name: "",
        category: "",
        is_special: "",
      });
      return;
    }

    setFilters((prev) => ({
      ...prev,
      ...values,
      page: 1,
    }));
  };

  /* ================= PAGE CHANGE ================= */
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  /* ================= IMAGE HANDLER ================= */
  const getImageUrl = (image?: string) => {
    if (!image) return "/default.jpg";
    if (image.startsWith("http")) return image;
    return `${import.meta.env.VITE_FILE_URL}${image}`;
  };

  /* ================= FILTER FIELDS ================= */
  const filterFields: FilterField[] = [
    { key: "name", label: "Search Item", type: "text" },
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

  return (
    <>
      <Navbar />

      <div className="mt-10 mb-10 px-4 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-brand mb-6">
          Our Menu
        </h1>

        {/* FILTER */}
        <Filter filters={filterFields} onChange={handleFilterChange} />

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500 mt-4">Loading items...</p>
        )}

        {/* GRID */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={{
                id: Number(item._id),
                name: item.name,
                description: item.description,
                image: getImageUrl(item.image),
                is_special: item.is_special,
                category:
                  typeof item.category === "string"
                    ? item.category
                    : item.category?.name,
              }}
            />
          ))}
        </div>

        {/* EMPTY */}
        {!loading && items.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No items found</p>
        )}

        {/* PAGINATION */}
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          limit={filters.limit}
          onPageChange={handlePageChange}
        />
      </div>

      <Footer />
    </>
  );
};

export default Items;

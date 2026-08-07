import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Pagination from "@/components/Admin/common/Pagination";
import { PrimaryButton } from "@/components/common/form/Button";
import SelectField from "@/components/common/form/SelectField";
import TextAreaField from "@/components/common/form/TextAreaField";
import LoginModal from "@/components/auth/LoginModal";

import { itemsList } from "@/services/itemsService";
import { createReview, reviewsList } from "@/services/reviewsService";
import { getToken, getUser } from "@/utils/storage";
import { toastError, toastSuccess } from "@/utils/toast";

import { FiStar } from "react-icons/fi";

type Review = {
  _id: string;
  user?: {
    first_name: string;
    last_name: string;
  };
  product?: {
    name: string;
  };
  rating?: number;
  comment?: string;
  createdAt?: string;
};

type ProductOption = {
  _id: string;
  name: string;
};

const Reviews = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loginOpen, setLoginOpen] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState(() => getUser());

  const [form, setForm] = useState({
    product: "",
    rating: "",
    comment: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const onAuthChanged = () => {
      setUser(getUser());
      setToken(getToken());
    };

    window.addEventListener("authChanged", onAuthChanged);
    return () => window.removeEventListener("authChanged", onAuthChanged);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await itemsList({ page: 1, limit: 1000 });
      const list = Array.isArray(res?.data) ? res.data : [];
      setProducts(list);
    } catch {
      setProducts([]);
    }
  }, []);

  const fetchReviews = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);
        const res = await reviewsList(params);

        setReviews(Array.isArray(res?.data) ? res.data : []);
        setPagination({
          page: res?.page ?? 1,
          totalPages: res?.totalPages ?? 1,
          totalItems: res?.total ?? 0,
        });
      } catch (err: unknown) {
        toastError(
          err instanceof Error ? err.message : "Failed to load reviews",
        );
        setReviews([]);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchReviews(filters);
  }, [fetchReviews, filters]);

  const ratingOptions = useMemo(
    () => [
      { label: "1 Star", value: "1" },
      { label: "2 Stars", value: "2" },
      { label: "3 Stars", value: "3" },
      { label: "4 Stars", value: "4" },
      { label: "5 Stars", value: "5" },
    ],
    [],
  );

  const productOptions = useMemo(
    () => products.map((p) => ({ label: p.name, value: p._id })),
    [products],
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.product) next.product = "Please select a product";
    if (!form.rating) next.rating = "Please select a rating";
    if (!token || !user) next._auth = "Please login to submit a review";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const getRatingUI = (rating?: number) => {
    if (!rating) return "-";

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={14}
            className={
              star <= rating
                ? "text-yellow-500 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating})</span>
      </div>
    );
  };

  const onSubmit = async () => {
    if (!token || !user) {
      setLoginOpen(true);
      return;
    }

    if (!validate()) return;

    try {
      setSubmitting(true);

      const ratingNumber = Number(form.rating);

      await createReview({
        product: form.product,
        rating: ratingNumber,
        comment: form.comment,
      });

      toastSuccess("Review submitted successfully!");
      setForm({ product: "", rating: "", comment: "" });
      setErrors({});

      // Refresh list so the new review appears immediately.
      setFilters((prev) => ({ ...prev, page: 1 }));
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <div className="mt-10 mb-10 px-4 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-brand mb-6">
          Customer Reviews
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= REVIEW FORM ================= */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Give a Review
            </h2>

            <div className="space-y-3">
              <SelectField
                label="Product"
                name="product"
                value={form.product}
                options={productOptions}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setForm((prev) => ({ ...prev, [name]: value }));
                  setErrors((prev) => ({ ...prev, [name]: "" }));
                }}
                error={errors.product}
              />

              <SelectField
                label="Rating"
                name="rating"
                value={form.rating}
                options={ratingOptions}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setForm((prev) => ({ ...prev, [name]: value }));
                  setErrors((prev) => ({ ...prev, [name]: "" }));
                }}
                error={errors.rating}
              />

              <TextAreaField
                label="Comment (optional)"
                name="comment"
                value={form.comment}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setForm((prev) => ({ ...prev, [name]: value }));
                }}
              />

              <PrimaryButton
                label={submitting ? "Submitting..." : "Submit Review"}
                onClick={onSubmit}
                loading={submitting}
                fullWidth
              />

              {user ? null : (
                <p className="text-xs text-gray-500 text-center">
                  Login is required to submit a review.
                </p>
              )}
            </div>
          </div>

          {/* ================= REVIEWS LIST ================= */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {loading ? (
                <p className="text-gray-600">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-gray-600">No active reviews yet.</p>
              ) : (
                reviews.map((r) => (
                  <div
                    key={r._id}
                    className="bg-white border border-gray-200 rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {r.product?.name || "Product"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          By {r.user?.first_name + " " + r.user?.last_name || "User"}
                        </p>
                      </div>

                      <div>{getRatingUI(r.rating)}</div>
                    </div>

                    {r.comment ? (
                      <p className="text-sm text-gray-700 mt-3">
                        {r.comment}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              limit={filters.limit}
              onPageChange={(page) =>
                setFilters((prev) => ({ ...prev, page }))
              }
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Reviews;


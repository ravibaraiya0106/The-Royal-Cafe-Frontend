import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { ROUTES } from "@/constants/Navigation";
import { useCart } from "@/hooks/useCart";
import InputField from "@/components/common/form/InputField";
import TextAreaField from "@/components/common/form/TextAreaField";
import SelectField from "@/components/common/form/SelectField";
import { DangerButton, PrimaryButton } from "@/components/common/form/Button";
import { toastError, toastSuccess } from "@/utils/toast";
import LoginModal from "@/components/auth/LoginModal";
import { ENDPOINTS } from "@/api/endpoints";
import { postRequest } from "@/services/apiService";
import { getAvailableCoupons } from "@/services/couponsService";
import { getToken, getUser } from "@/utils/storage";
import SelectCouponModal from "@/components/common/modals/SelectCouponModal";

type CheckoutForm = {
  phone: string;
  address: string;
  paymentMethod: "COD" | "UPI" | "CARD";
  notes?: string;
  couponCode?: string;
};

const paymentOptions = [
  { label: "Cash on Delivery (COD)", value: "COD" },
  { label: "UPI", value: "UPI" },
  { label: "Card", value: "CARD" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartCount, clearCart } = useCart();

  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState(() => getUser());
  const [loginOpen, setLoginOpen] = useState<boolean>(
    () => !getToken() || !getUser(),
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<null | {
    code: string;
    description: string;
    discount_type: "percentage" | "flat";
    discount_value: number;
    min_order_amount: number;
    max_discount: number | null;
    expiry_date: string;
  }>(null);

  const [form, setForm] = useState<CheckoutForm>({
    phone: "",
    address: "",
    paymentMethod: "COD",
    notes: "",
    couponCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleAuthChanged = () => {
      const nextUser = getUser();
      const nextToken = getToken();

      setUser(nextUser);
      setToken(nextToken);
      setLoginOpen(!nextToken || !nextUser);
    };

    window.addEventListener("authChanged", handleAuthChanged);
    return () => window.removeEventListener("authChanged", handleAuthChanged);
  }, []);

  useEffect(() => {
    if (success) return;
    if (items.length === 0) {
      navigate(ROUTES.ITEMS, { replace: true });
    }
  }, [items.length, navigate, success]);

  const hasPrices = useMemo(() => {
    return (
      items.length > 0 && items.every((it) => typeof it.price === "number")
    );
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      if (typeof it.price !== "number") return sum;
      return sum + it.price * it.quantity;
    }, 0);
  }, [items]);

  const offerDiscountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;

    const { discount_type, discount_value, max_discount, min_order_amount } =
      appliedCoupon;

    if (subtotal < min_order_amount) return 0;

    const raw =
      discount_type === "percentage"
        ? (subtotal * discount_value) / 100
        : discount_value;

    const capped = max_discount != null ? Math.min(raw, max_discount) : raw;
    if (!Number.isFinite(capped)) return 0;
    return Math.max(0, capped);
  }, [appliedCoupon, subtotal]);

  const totalAfterDiscount = useMemo(() => {
    return Math.max(0, subtotal - offerDiscountAmount);
  }, [subtotal, offerDiscountAmount]);

  useEffect(() => {
    const code = (form.couponCode || "").trim();

    if (!code) {
      setAppliedCoupon(null);
      return;
    }

    if (!hasPrices) {
      setAppliedCoupon(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const list = await getAvailableCoupons(subtotal);
        const match =
          Array.isArray(list) && list.length > 0
            ? list.find((c) => c.code === code) ?? null
            : null;

        if (!cancelled) setAppliedCoupon(match);
      } catch {
        if (!cancelled) setAppliedCoupon(null);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [form.couponCode, hasPrices, subtotal]);


  const formatMoney = (value: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const validate = useCallback(() => {
    const nextErrors: Record<string, string> = {};

    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";
    if (!form.address.trim()) nextErrors.address = "Address is required";
    if (!form.paymentMethod)
      nextErrors.paymentMethod = "Payment method is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }, []);

  const handlePaymentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: value as CheckoutForm["paymentMethod"],
      }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [],
  );

  const placeOrder = useCallback(async () => {
    if (items.length === 0) return;
    if (!validate()) return;

    try {
      setLoading(true);

      // 1) Sync local cart into backend cart for the logged-in user
      await Promise.all(
        items.map(async (it) => {
          const res = await postRequest(ENDPOINTS.CART.CREATE, {
            product: it.productId,
            quantity: it.quantity,
          });

          const { success, message } = res.data as {
            success: boolean;
            message: string;
          };

          if (!success) throw new Error(message || "Failed to add to cart");
        }),
      );

      // 2) Create the order in DB
      const orderRes = await postRequest(ENDPOINTS.ORDER.CREATE, {
        address: form.address,
        phone: form.phone,
        payment_method: form.paymentMethod,
        notes: form.notes || "",
        coupon_code: form.couponCode || "",
      });

      const { success, message, responseData } = orderRes.data as {
        success: boolean;
        message: string;
        responseData: {
          order?: {
            order_number?: string;
            final_amount?: number;
            discount_amount?: number;
          };
        };
      };

      if (!success) throw new Error(message || "Failed to create order");
      const nextOrderNumber = responseData?.order?.order_number ?? "";
      const nextFinalAmount = responseData?.order?.final_amount ?? 0;

      setOrderId(nextOrderNumber);
      setFinalAmount(nextFinalAmount);
      clearCart();
      setSuccess(true);
      toastSuccess(message);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  }, [
    clearCart,
    items,
    form.address,
    form.phone,
    form.paymentMethod,
    form.couponCode,
    form.notes,
    validate,
  ]);

  if (success) {
    return (
      <>
        <Navbar />
        <div className="mt-10 mb-10 px-4 max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold text-brand mb-2">
            Order Confirmed
          </h1>
          <p className="text-gray-600">
            Your order has been placed. Order ID:{" "}
            <span className="font-semibold">{orderId}</span>
          </p>
          <p className="text-gray-600 mt-2">
            Total Amount:{" "}
            <span className="font-semibold text-gray-900">
              {formatMoney(finalAmount)}
            </span>
          </p>

          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-sm text-gray-600">
              Payment Method:{" "}
              <span className="font-semibold text-gray-900">
                {form.paymentMethod}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Delivery to:{" "}
              <span className="font-semibold text-gray-900">
                {form.address}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3 flex-wrap">
            <Link
              to={ROUTES.ITEMS}
              className="inline-flex items-center justify-center border border-brand text-brand px-6 py-3 rounded-[5px] shadow hover:bg-brand hover:text-white transition"
            >
              Continue Shopping
            </Link>
            <DangerButton
              label="Clear Form"
              onClick={() => {
                setSuccess(false);
                setForm({
                  phone: "",
                  address: "",
                  paymentMethod: "COD",
                  notes: "",
                  couponCode: "",
                });
                setErrors({});
                setOrderId("");
                setFinalAmount(0);
              }}
              fullWidth={false}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!token || !user) {
    return (
      <>
        <Navbar />
        <LoginModal open={loginOpen} onClose={() => navigate(ROUTES.ITEMS)} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <SelectCouponModal
        open={couponModalOpen}
        orderAmount={subtotal}
        onClose={() => setCouponModalOpen(false)}
        onApply={(code) => {
          setForm((prev) => ({
            ...prev,
            couponCode: code,
          }));
          toastSuccess(`Coupon applied: ${code}`);
        }}
      />

      <div className="mt-10 mb-10 px-4 max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-brand mb-1">Checkout</h1>
            <p className="text-gray-600">{cartCount} item(s) ready for order</p>
          </div>
          <div className="text-sm text-gray-600">
            Need to change items?{" "}
            <span
              className="text-brand font-semibold cursor-pointer hover:underline"
              onClick={() => navigate(ROUTES.CART)}
            >
              Back to Cart
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Delivery Details
            </h2>

            <InputField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />

            <TextAreaField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              error={errors.address}
              row={3}
            />

            <TextAreaField
              label="Notes (optional)"
              name="notes"
              value={form.notes || ""}
              onChange={handleChange}
              row={2}
            />

            <div className="mt-2 flex gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <InputField
                  label="Coupon Code (optional)"
                  name="couponCode"
                  value={form.couponCode || ""}
                  onChange={handleChange}
                  error={errors.couponCode}
                />
              </div>

              <button
                type="button"
                onClick={() => setCouponModalOpen(true)}
                className="shrink-0 border border-brand text-brand px-4 h-10 rounded-[5px] shadow hover:bg-brand hover:text-white transition text-sm font-semibold flex items-center justify-center"
              >
                Select Coupon
              </button>
            </div>

            <div className="mt-2">
              <SelectField
                label="Payment Method"
                name="paymentMethod"
                value={form.paymentMethod}
                options={paymentOptions}
                onChange={handlePaymentChange}
                error={errors.paymentMethod}
              />
            </div>

            <div className="mt-5">
              <PrimaryButton
                label={loading ? "Placing Order..." : "Place Order"}
                onClick={placeOrder}
                loading={loading}
                fullWidth
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {hasPrices ? formatMoney(subtotal) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Taxes</span>
                <span className="font-semibold text-gray-900">
                  {hasPrices ? formatMoney(0) : "N/A"}
                </span>
              </div>
              {appliedCoupon ? (
                <div className="space-y-1">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">
                      Offer ({appliedCoupon.code})
                    </span>
                    <span className="font-semibold text-brand">
                      -{hasPrices ? formatMoney(offerDiscountAmount) : "₹0"}
                    </span>
                  </div>
                  {appliedCoupon.description ? (
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {appliedCoupon.description}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="text-gray-700 font-medium">Total</span>
                <span className="text-gray-900 font-bold text-lg">
                  {hasPrices ? formatMoney(totalAfterDiscount) : "N/A"}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Items
              </h3>
              <div className="space-y-2 max-h-56 overflow-auto pr-1">
                {items.map((it) => (
                  <div
                    key={it.productId}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-gray-700 truncate">
                      {it.name} × {it.quantity}
                    </span>
                    {typeof it.price === "number" ? (
                      <span className="text-gray-900 font-semibold">
                        {formatMoney(it.price * it.quantity)}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">N/A</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;

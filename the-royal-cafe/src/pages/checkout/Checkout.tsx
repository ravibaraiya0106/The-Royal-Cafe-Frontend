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
import { getToken, getUser } from "@/utils/storage";

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: "COD" | "UPI" | "CARD";
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
  const [loginOpen, setLoginOpen] = useState<boolean>(() => !getToken() || !getUser());

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
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
    if (!user || typeof user !== "object") return;

    const first = (user.first_name ?? "").toString();
    const last = (user.last_name ?? "").toString();
    const fullName = `${first} ${last}`.trim();

    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || fullName,
      email: prev.email || (user.email ?? ""),
    }));
  }, [user]);

  useEffect(() => {
    if (success) return;
    if (items.length === 0) {
      navigate(ROUTES.ITEMS, { replace: true });
    }
  }, [items.length, navigate, success]);

  const hasPrices = useMemo(() => {
    return items.length > 0 && items.every((it) => typeof it.price === "number");
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      if (typeof it.price !== "number") return sum;
      return sum + it.price * it.quantity;
    }, 0);
  }, [items]);

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const validate = useCallback(() => {
    const nextErrors: Record<string, string> = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";
    if (!form.address.trim()) nextErrors.address = "Address is required";
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.pincode.trim()) nextErrors.pincode = "Pincode is required";
    if (!form.paymentMethod) nextErrors.paymentMethod = "Payment method is required";

    const pincodeDigits = form.pincode.replace(/\D/g, "");
    if (form.pincode.trim() && pincodeDigits.length < 6) {
      nextErrors.pincode = "Pincode must be at least 6 digits";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    },
    [],
  );

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
      });

      const { success, message, responseData } = orderRes.data as {
        success: boolean;
        message: string;
        responseData: { order?: { order_number?: string } };
      };

      if (!success) throw new Error(message || "Failed to create order");
      const nextOrderNumber = responseData?.order?.order_number ?? "";

      setOrderId(nextOrderNumber);
      clearCart();
      setSuccess(true);
      toastSuccess("Order placed successfully!");
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
    validate,
  ]);

  if (success) {
    return (
      <>
        <Navbar />
        <div className="mt-10 mb-10 px-4 max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold text-brand mb-2">Order Confirmed</h1>
          <p className="text-gray-600">
            Your order has been placed. Order ID:{" "}
            <span className="font-semibold">{orderId}</span>
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
                {form.address}, {form.city} - {form.pincode}
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
                  fullName: "",
                  email: "",
                  phone: "",
                  address: "",
                  city: "",
                  pincode: "",
                  paymentMethod: "COD",
                });
                setErrors({});
                setOrderId("");
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
        <LoginModal
          open={loginOpen}
          onClose={() => navigate(ROUTES.ITEMS)}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
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
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <InputField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              type="email"
            />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
              />
              <InputField
                label="Pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                error={errors.pincode}
              />
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

            <p className="mt-3 text-xs text-gray-500 leading-relaxed">
              Placing your order will save it in the database and clear your
              cart after success.
            </p>
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
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="text-gray-700 font-medium">Total</span>
                <span className="text-gray-900 font-bold text-lg">
                  {hasPrices ? formatMoney(subtotal) : "N/A"}
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


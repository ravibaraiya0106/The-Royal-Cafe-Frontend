import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { ROUTES } from "@/constants/Navigation";
import { useCart } from "@/hooks/useCart";
import {
  PrimaryButton,
  DangerButton,
  RoundButton,
} from "@/components/common/form/Button";
import { toastInfo, toastSuccess } from "@/utils/toast";
import ConfirmDialog from "@/components/Admin/modals/ConfirmDialog";

const Cart = () => {
  const { items, cartCount, addItem, decrementItem, removeItem, clearCart } =
    useCart();
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

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

  const handleCheckout = useCallback(() => {
    if (items.length === 0) return;
    toastInfo("Checkout flow is not connected yet.");
    // Keeping items intact to avoid surprising data loss.
  }, [items.length]);

  const handleRequestClear = useCallback(() => {
    if (items.length === 0) return;
    setClearConfirmOpen(true);
  }, [items.length]);

  const handleConfirmClear = useCallback(() => {
    clearCart();
    setClearConfirmOpen(false);
    toastSuccess("Cart cleared.");
  }, [clearCart]);

  const handleIncrement = useCallback(
    (productId: string) => {
      const item = items.find((it) => it.productId === productId);
      if (!item) return;
      addItem({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: 1,
      });
    },
    [addItem, items],
  );

  const handleDecrement = useCallback(
    (productId: string) => {
      decrementItem(productId);
    },
    [decrementItem],
  );

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="mt-10 mb-10 px-4 max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold text-brand mb-3">Your Cart</h1>
          <p className="text-gray-600">
            Your cart is empty. Add something delicious to get started.
          </p>
          <div className="mt-6">
            <Link
              to={ROUTES.ITEMS}
              className="inline-block border border-brand text-brand px-6 py-3 rounded-[5px] shadow hover:bg-brand hover:text-white transition"
            >
              Browse Menu
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ConfirmDialog
        open={clearConfirmOpen}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart?"
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        confirmLabel="Clear Cart"
        cancelLabel="Cancel"
        confirmLoadingLabel="Clearing..."
      />
      <div className="mt-10 mb-10 px-4 max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-brand mb-1">Your Cart</h1>
            <p className="text-gray-600">{cartCount} item(s) in cart</p>
          </div>

          <div className="flex gap-3">
            <DangerButton label="Clear Cart" onClick={handleRequestClear} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
            <div className="space-y-4">
              {items.map((it) => (
                <div
                  key={it.productId}
                  className="flex items-center gap-4 border-b border-gray-100 pb-4 last:pb-0 last:border-b-0"
                >
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {it.name}
                    </p>
                    {hasPrices && typeof it.price === "number" ? (
                      <p className="text-sm text-gray-600">
                        {formatMoney(it.price)} each
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Price not available
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <RoundButton
                      icon={<FiMinus size={16} />}
                      variant="secondary"
                      onClick={() => handleDecrement(it.productId)}
                    />
                    <span className="font-semibold text-lg w-6 text-center">
                      {it.quantity}
                    </span>
                    <RoundButton
                      icon={<FiPlus size={16} />}
                      variant="primary"
                      onClick={() => handleIncrement(it.productId)}
                    />

                    <button
                      type="button"
                      onClick={() => removeItem(it.productId)}
                      className="ml-2 text-gray-600 hover:text-brand transition p-2 rounded-lg hover:bg-gray-50"
                      aria-label={`Remove ${it.name}`}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
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

              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="text-gray-700 font-medium">Total</span>
                <span className="text-gray-900 font-bold text-lg">
                  {hasPrices ? formatMoney(subtotal) : "N/A"}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <PrimaryButton
                label="Proceed to Checkout"
                onClick={handleCheckout}
                fullWidth
              />
            </div>

            <p className="mt-3 text-xs text-gray-500 leading-relaxed">
              Checkout is a UI placeholder for now. Your cart items are saved
              locally so you can keep browsing.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;


import { useEffect, useMemo, useState } from "react";
import { toastError } from "@/utils/toast";
import { getAvailableCoupons } from "@/services/couponsService";
import type { ReactNode } from "react";
import { Paper, Typography } from "@mui/material";
import { FiX } from "react-icons/fi";
import IconButton from "@mui/material/IconButton";
import logo from "@/assets/images/logo.png";

type Coupon = {
  code: string;
  description: string;
  discount_type: "percentage" | "flat";
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  expiry_date: string;
};

type Props = {
  open: boolean;
  orderAmount: number;
  onClose: () => void;
  onApply: (couponCode: string) => void;
  emptyState?: ReactNode;
};

const SelectCouponModal = ({
  open,
  orderAmount,
  onClose,
  onApply,
  emptyState,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    if (!open) return;

    const run = async () => {
      try {
        setLoading(true);
        const res = await getAvailableCoupons(orderAmount);
        setCoupons(Array.isArray(res) ? res : []);
      } catch (err: unknown) {
        toastError(err instanceof Error ? err.message : "Failed to load coupons");
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [open, orderAmount]);

  const formatExpiry = useMemo(() => {
    return (iso: string) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "-";
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Paper elevation={0} sx={{ p: 4, borderRadius: "5px" }}>
          {/* BRAND */}
          <div className="text-center mb-4 relative">
            <img src={logo} className="h-16 mx-auto" alt="Brand logo" />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Select an applicable coupon for your order
            </Typography>

            <div className="absolute top-0 right-0">
              <IconButton onClick={onClose} size="small">
                <FiX size={20} />
              </IconButton>
            </div>
          </div>

          <div>
            {loading ? (
              <p className="text-gray-600">Loading coupons...</p>
            ) : coupons.length === 0 ? (
              <div className="text-gray-600 text-center py-4">
                {emptyState ?? (
                  <>No coupons are applicable for this order amount.</>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-auto pr-1">
                {coupons.map((c) => {
                  const discountLabel =
                    c.discount_type === "percentage"
                      ? `${c.discount_value}% off`
                      : `Flat ₹${c.discount_value} off`;

                  return (
                    <div
                      key={c.code}
                      className="border border-gray-200 rounded-xl p-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">
                            {c.code}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {discountLabel}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Min order: ₹{c.min_order_amount}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Expires: {formatExpiry(c.expiry_date)}
                          </p>
                          {c.description ? (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                              {c.description}
                            </p>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onApply(c.code);
                            onClose();
                          }}
                          className="shrink-0 border border-brand text-brand px-4 py-2 rounded-[5px] shadow hover:bg-brand hover:text-white transition text-sm font-semibold"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default SelectCouponModal;


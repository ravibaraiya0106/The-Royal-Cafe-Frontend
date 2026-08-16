export const formatMoney = (value: number | undefined | null): string => {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return "₹0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatRupee = (value: number | undefined | null): string => {
  return formatMoney(value);
};

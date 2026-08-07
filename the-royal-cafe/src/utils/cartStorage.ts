export type CartItem = {
  productId: string;
  name: string;
  image: string;
  price?: number;
  quantity: number;
};

const CART_KEY = "royal_cafe_cart_v1";

export const loadCartItems = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const toCartItem = (it: unknown): CartItem | null => {
      if (typeof it !== "object" || it === null) return null;

      const obj = it as Record<string, unknown>;

      const productId = typeof obj.productId === "string" ? obj.productId : "";
      const name = typeof obj.name === "string" ? obj.name : "";
      const image = typeof obj.image === "string" ? obj.image : "";

      const price =
        typeof obj.price === "number" && Number.isFinite(obj.price)
          ? obj.price
          : undefined;

      const quantity =
        typeof obj.quantity === "number" && Number.isFinite(obj.quantity)
          ? obj.quantity
          : 1;

      if (!productId || !name || !image) return null;
      if (!Number.isFinite(quantity) || quantity <= 0) return null;

      return { productId, name, image, price, quantity };
    };

    const items: CartItem[] = parsed.map(toCartItem).filter((it): it is CartItem => Boolean(it));

    return items;
  } catch {
    return [];
  }
};

export const saveCartItems = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const getCartCount = (items: CartItem[]) => {
  return items.reduce((sum, it) => sum + (it.quantity || 0), 0);
};


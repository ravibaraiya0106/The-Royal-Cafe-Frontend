import { useCallback, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/utils/cartStorage";
import { getCartCount, loadCartItems, saveCartItems } from "@/utils/cartStorage";

type CartInput = Omit<CartItem, "quantity"> & { quantity?: number };

const CART_UPDATED_EVENT = "cartUpdated";

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(() => loadCartItems());

  useEffect(() => {
    const onCartUpdated = () => {
      setItems(loadCartItems());
    };

    window.addEventListener(CART_UPDATED_EVENT, onCartUpdated);
    return () => window.removeEventListener(CART_UPDATED_EVENT, onCartUpdated);
  }, []);

  const persistAndBroadcast = useCallback((nextItems: CartItem[]) => {
    saveCartItems(nextItems);
    setItems(nextItems);
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }, []);

  const cartCount = useMemo(() => getCartCount(items), [items]);

  const upsertItem = useCallback(
    (input: CartInput) => {
      const productId = String(input.productId);
      const qtyToAdd = input.quantity ?? 1;

      if (!productId || !input.name || !input.image) return;
      if (!Number.isFinite(qtyToAdd) || qtyToAdd <= 0) return;

      const existing = items.find((it) => it.productId === productId);

      const nextItems = existing
        ? items.map((it) =>
            it.productId === productId
              ? { ...it, quantity: it.quantity + qtyToAdd }
              : it,
          )
        : [
            ...items,
            {
              productId,
              name: input.name,
              image: input.image,
              price: input.price,
              quantity: qtyToAdd,
            },
          ];

      persistAndBroadcast(nextItems);
    },
    [items, persistAndBroadcast],
  );

  const decrementItem = useCallback(
    (productId: string) => {
      const id = String(productId);
      if (!id) return;

      const nextItems = items
        .map((it) =>
          it.productId === id ? { ...it, quantity: it.quantity - 1 } : it,
        )
        .filter((it) => it.quantity > 0);

      persistAndBroadcast(nextItems);
    },
    [items, persistAndBroadcast],
  );

  const removeItem = useCallback(
    (productId: string) => {
      const id = String(productId);
      if (!id) return;

      const nextItems = items.filter((it) => it.productId !== id);
      persistAndBroadcast(nextItems);
    },
    [items, persistAndBroadcast],
  );

  const clearCart = useCallback(() => {
    persistAndBroadcast([]);
  }, [persistAndBroadcast]);

  return {
    items,
    cartCount,
    addItem: upsertItem,
    decrementItem,
    removeItem,
    clearCart,
  };
};


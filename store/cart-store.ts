import { ProductParams } from "@/shared.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStoreParams {
  items: ProductParams[];
  addItem: (item: ProductParams) => void;
  decreaseQty: (id: string) => void;
  increaseQty: (id: string) => void;
  clearCartItems: () => void;
}
export const cartStore = create<CartStoreParams>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingCartItems = state.items.find((i) => i.id === item.id);

          if (existingCartItems) {
            return {
              items: state.items.map((eachItem) =>
                eachItem.id === item.id
                  ? { ...eachItem, quantity: eachItem.quantity + 1 }
                  : eachItem
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        }),
      decreaseQty: (id: string) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        })),
      increaseQty: (id: string) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),
      clearCartItems: () => set({ items: [] }),
    }),

    { name: "cart-storage" }
  )
);

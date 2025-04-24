import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create()(
    persist(
        (set) => ({
            cart: [],
            setCart: (data) =>
                set({
                    cart: data,
                }),
        }),
        {
            name: "cart-storage",
            partialize: (state) => ({
                cart: state.cart,
            }),
        }
    )
);

export default useCartStore;

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAddressStore = create()(
    persist(
        (set) => ({
            address: [],
            setAddress: (data) =>
                set({
                    address: data,
                }),
        }),
        {
            name: "address-storage",
            partialize: (state) => ({
                address: state.address,
            }),
        }
    )
);

export default useAddressStore;

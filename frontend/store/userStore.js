import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create()(
    persist(
        (set) => ({
            userId: null,
            userName: null,
            userEmail: null,
            userToken: null,
            setUser: ({ _id, email, full_name, token }) =>
                set({
                    userId: _id,
                    userName: full_name,
                    userEmail: email,
                    userToken: token,
                }),
        }),
        {
            name: "user-storage", // Nama key di localStorage
            partialize: (state) => ({
                userId: state.userId,
                userEmail: state.userEmail,
                userName: state.userName,
                userToken: state.userToken,
            }), // Menyimpan hanya idUser dan emailUser
        }
    )
);

export default useUserStore;

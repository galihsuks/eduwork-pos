import { create } from "zustand";

const useMessageStore = create((set) => ({
    message: "",
    setMessage: (text) => {
        set(() => ({
            message: text,
        }));
    },
    getMessage: () => {
        let pesan = "";
        set((state) => {
            pesan = state.message;
            return {
                message: "",
            };
        });
        return pesan;
    },
}));

export default useMessageStore;

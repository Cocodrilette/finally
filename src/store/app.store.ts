import { create } from "zustand";

type AppStore = {
  hideValues: boolean;
  toggleHideValues: () => void;
};

export const useAppStore = create<AppStore>()((set) => ({
  hideValues: false,
  toggleHideValues: () => set((state) => ({ hideValues: !state.hideValues })),
}));

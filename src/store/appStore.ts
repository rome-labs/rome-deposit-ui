import { create } from "zustand";

interface AppState {
  isDeposit: boolean;
  setIsDeposit: (isDeposit: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDeposit: false,
  setIsDeposit: (isDeposit) => set({ isDeposit }),
}));

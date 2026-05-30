import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  isUniformMode: boolean;
  setUniformMode: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isUniformMode: false,
      setUniformMode: (enabled) => set({ isUniformMode: enabled }),
    }),
    {
      name: "rpg-portrait:settings",
    },
  ),
);

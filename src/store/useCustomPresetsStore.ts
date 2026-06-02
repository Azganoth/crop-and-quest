import { Preset } from "@/data/presets";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CustomPresetsState {
  customPresets: Preset[];
  addCustomPreset: (preset: Preset) => void;
  removeCustomPreset: (id: string) => void;
}

export const useCustomPresetsStore = create<CustomPresetsState>()(
  persist(
    (set) => ({
      customPresets: [],
      addCustomPreset: (preset) =>
        set((state) => ({ customPresets: [...state.customPresets, preset] })),
      removeCustomPreset: (id) =>
        set((state) => ({
          customPresets: state.customPresets.filter((preset) => preset.id !== id),
        })),
    }),
    {
      name: "crop-and-quest-custom-presets",
    },
  ),
);

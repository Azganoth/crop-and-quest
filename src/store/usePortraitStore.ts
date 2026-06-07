import { create } from "zustand";

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropState {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
  croppedBlobUrl?: string;
  croppedAreaPixels?: CropArea;
}

export type CropStateMap = Record<string, CropState>;

export interface PortraitSession {
  presetId: string;
  imageFile: File | null;
  imageUrl: string | null;
  crops: Partial<CropStateMap>;

  setPresetId: (id: string) => void;
  setImage: (file: File) => void;
  setCrop: (variantKey: string, crop: CropState) => void;
  clearSession: () => void;
}

export const usePortraitStore = create<PortraitSession>((set, get) => ({
  presetId: "",
  imageFile: null,
  imageUrl: null,
  crops: {},

  setPresetId: (id) => set({ presetId: id }),

  setImage: (file) => {
    const currentUrl = get().imageUrl;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }

    const newUrl = URL.createObjectURL(file);

    set({
      imageFile: file,
      imageUrl: newUrl,
      crops: {},
    });
  },

  setCrop: (variantKey, crop) =>
    set((state) => {
      const previousCrop = state.crops[variantKey];
      if (previousCrop?.croppedBlobUrl) {
        URL.revokeObjectURL(previousCrop.croppedBlobUrl);
      }
      return {
        crops: {
          ...state.crops,
          [variantKey]: crop,
        },
      };
    }),

  clearSession: () => {
    const state = get();
    if (state.imageUrl) {
      URL.revokeObjectURL(state.imageUrl);
    }
    Object.values(state.crops).forEach((crop) => {
      if (crop?.croppedBlobUrl) {
        URL.revokeObjectURL(crop.croppedBlobUrl);
      }
    });

    set({
      presetId: "",
      imageFile: null,
      imageUrl: null,
      crops: {},
    });
  },
}));

import { create } from "zustand";

export interface CropState {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
  croppedAreaPixels?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type CropStateMap = Record<string, CropState>;

export interface PortraitSession {
  gameId: string;
  imageFile: File | null;
  imageUrl: string | null;
  crops: Partial<CropStateMap>;

  // Actions
  setGameId: (id: string) => void;
  setImage: (file: File) => void;
  setCrop: (variantKey: string, crop: CropState) => void;
  clearSession: () => void;
}

export const usePortraitStore = create<PortraitSession>((set, get) => ({
  gameId: "",
  imageFile: null,
  imageUrl: null,
  crops: {},

  setGameId: (id) => set({ gameId: id }),

  setImage: (file) => {
    const currentUrl = get().imageUrl;
    // Revoke previous object URL to prevent memory leaks
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }

    // Create new object URL for the uploaded file
    const newUrl = URL.createObjectURL(file);

    // Reset crops when a new image is uploaded
    set({
      imageFile: file,
      imageUrl: newUrl,
      crops: {},
    });
  },

  setCrop: (variantKey, crop) =>
    set((state) => ({
      crops: {
        ...state.crops,
        [variantKey]: crop,
      },
    })),

  clearSession: () => {
    const currentUrl = get().imageUrl;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    set({
      gameId: "",
      imageFile: null,
      imageUrl: null,
      crops: {},
    });
  },
}));

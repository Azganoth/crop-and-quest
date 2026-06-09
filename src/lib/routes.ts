export const ROUTES = {
  home: "/",

  custom: {
    _base: "/custom",
    new: "/custom/new",
    edit: (presetId: string) => `/custom/${presetId}/edit`,
  },

  create: {
    _base: "/create",
    select: (presetId: string) => `/create/${presetId}/select`,
    crop: (presetId: string, variantKey: string, options?: { singleEdit?: boolean }) => {
      const base = `/create/${presetId}/${variantKey}`;
      return options?.singleEdit ? `${base}?singleEdit=true` : base;
    },
    review: (presetId: string) => `/create/${presetId}/review`,
  },
} as const;

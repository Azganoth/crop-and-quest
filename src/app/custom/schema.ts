import * as v from "valibot";

export const presetVariantInputSchema = v.object({
  label: v.pipe(v.string(), v.trim(), v.minLength(1, "Label is required")),
  width: v.pipe(v.string(), v.transform(Number), v.minValue(1, "Must be at least 1")),
  height: v.pipe(v.string(), v.transform(Number), v.minValue(1, "Must be at least 1")),
  format: v.picklist(["png", "jpeg", "webp", "bmp", "tga"], "Invalid format"),
  filename: v.pipe(v.string(), v.trim()),
  optional: v.boolean(),
});

export const presetInputSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1, "Preset name is required")),
  variants: v.pipe(
    v.array(presetVariantInputSchema),
    v.minLength(1, "At least one variant is required"),
  ),
  defaultName: v.pipe(v.string(), v.trim()),
  maxLength: v.union([
    v.pipe(
      v.string(),
      v.trim(),
      v.literal(""),
      v.transform(() => undefined),
    ),
    v.pipe(v.string(), v.transform(Number), v.minValue(1, "Must be at least 1")),
  ]),
  wrapInFolder: v.boolean(),
});

export type PresetVariantInput = v.InferInput<typeof presetVariantInputSchema>;
export type PresetInput = Omit<v.InferInput<typeof presetInputSchema>, "variants"> & {
  variants: PresetVariantInput[];
};

export const getDefaultVariant = (): PresetVariantInput => ({
  label: "Portrait",
  width: "256",
  height: "256",
  format: "png",
  filename: "{name}",
  optional: false,
});

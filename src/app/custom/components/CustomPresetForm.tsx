"use client";

import { Button } from "@/components/ui/Button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Panel } from "@/components/ui/Panel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { Preset, type PortraitExportFormat } from "@/data/presets";
import { getAspectRatioString } from "@/lib/math";
import { useCustomPresetsStore } from "@/store/useCustomPresetsStore";
import { useForm } from "@tanstack/react-form";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import * as v from "valibot";

const presetVariantInputSchema = v.object({
  label: v.pipe(v.string(), v.trim(), v.minLength(1, "Label is required")),
  width: v.pipe(v.string(), v.transform(Number), v.minValue(1, "Must be > 0")),
  height: v.pipe(v.string(), v.transform(Number), v.minValue(1, "Must be > 0")),
  format: v.picklist(["png", "jpeg", "webp", "bmp", "tga"], "Invalid format"),
  filename: v.pipe(v.string(), v.trim()),
  optional: v.boolean(),
});

const presetInputSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1, "Preset name is required")),
  variants: v.pipe(
    v.array(presetVariantInputSchema),
    v.minLength(1, "At least one variant is required"),
  ),
  defaultName: v.pipe(v.string(), v.trim()),
  maxLength: v.pipe(v.string(), v.transform(Number), v.minValue(1, "Must be > 0")),
  wrapInFolder: v.boolean(),
});

type PresetVariantInput = v.InferInput<typeof presetVariantInputSchema>;
type PresetInput = Omit<v.InferInput<typeof presetInputSchema>, "variants"> & {
  variants: PresetVariantInput[];
};

const getDefaultVariant = (): PresetVariantInput => ({
  label: "Portrait",
  width: "256",
  height: "256",
  format: "png",
  filename: "{name}.png",
  optional: false,
});

export function CustomPresetForm({
  mode,
  initialData,
}: {
  mode: "create" | "edit";
  initialData?: Preset;
}) {
  const router = useRouter();
  const { addCustomPreset, updateCustomPreset } = useCustomPresetsStore();

  const isEditMode = mode === "edit";

  const defaultValues = useMemo<PresetInput>(
    () => ({
      name: initialData?.name ?? "",
      defaultName: initialData?.exportConfig?.defaultName ?? "custom_portrait",
      maxLength: initialData?.exportConfig?.maxLength?.toString() ?? "",
      wrapInFolder: initialData?.exportConfig?.wrapInFolder ?? false,
      variants: initialData
        ? initialData.variants.map((v) => ({
            label: v.label,
            width: v.width.toString(),
            height: v.height.toString(),
            format: v.format,
            filename: v.filename,
            optional: false,
          }))
        : [getDefaultVariant()],
    }),
    [initialData],
  );

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: presetInputSchema,
    },
    onSubmit: ({ value }) => {
      const parsedValue = v.parse(presetInputSchema, value);
      const presetId = isEditMode && initialData ? initialData.id : `custom-${crypto.randomUUID()}`;

      const newPreset: Preset = {
        id: presetId,
        name: value.name,
        exportConfig: {
          wrapInFolder: parsedValue.wrapInFolder,
          defaultName: parsedValue.defaultName || "custom_portrait",
          maxLength: parsedValue.maxLength,
        },
        variants: parsedValue.variants.map((v, i) => {
          let finalFilename = v.filename;
          if (finalFilename) {
            if (!finalFilename.includes("{name}")) {
              finalFilename = `{name}${finalFilename}.${v.format}`;
            }
          } else {
            finalFilename = `{name}.${v.format}`;
          }

          return {
            key: `variant-${i}`,
            label: v.label,
            width: v.width,
            height: v.height,
            format: v.format,
            filename: finalFilename,
          };
        }),
      };

      if (isEditMode && initialData) {
        updateCustomPreset(presetId, newPreset);
        router.push("/");
      } else {
        addCustomPreset(newPreset);
        router.push(`/create/${presetId}/select`);
      }
    },
  });

  return (
    <div className="container mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 md:py-24">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">
          {mode === "create" ? "Create Custom Preset" : "Edit Custom Preset"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {mode === "create"
            ? "Define the exact dimensions required by your game or mod."
            : "Update dimensions or filenames for this preset."}
        </p>
      </header>

      <form
        className="flex flex-col gap-8"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Panel asChild>
          <section>
            <h2 className="font-display text-xl font-bold">General Settings</h2>
            <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <form.Field name="name">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Preset Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="e.g. Arcanum"
                        autoComplete="off"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="defaultName">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Default Portrait Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="e.g. PORTRAIT"
                        autoComplete="off"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="maxLength">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Max Filename Length (Optional)</FieldLabel>
                      <Input
                        type="number"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="wrapInFolder">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field orientation="horizontal" data-invalid={isInvalid}>
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>Wrap in Folder</FieldLabel>
                        <FieldDescription>
                          Places the images inside a folder in the ZIP.
                        </FieldDescription>
                        <FieldError errors={field.state.meta.errors} />
                      </FieldContent>
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={field.handleChange}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </section>
        </Panel>

        <form.Field name="variants" mode="array">
          {(field) => (
            <Panel asChild>
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold">Portrait Variants</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => field.pushValue(getDefaultVariant())}
                  >
                    <Plus className="mr-1 size-5" />
                    Add Variant
                  </Button>
                </div>

                <div className="flex flex-col gap-6">
                  {field.state.value.map((variant, i, arr) => (
                    <FieldSet
                      key={i}
                      className="rounded-lg border border-border/50 bg-background/50 p-4"
                    >
                      <div className="flex min-h-10 items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FieldLegend className="font-bold text-muted-foreground">
                            Variant {arr.length - i}
                          </FieldLegend>
                          {variant.width && variant.height && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="border border-border bg-secondary shadow-sm"
                                  style={{
                                    aspectRatio: `${variant.width} / ${variant.height}`,
                                    height: "32px",
                                  }}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <span className="font-semibold capitalize">Aspect Ratio</span>
                                <span className="ml-2 font-medium text-muted-foreground">
                                  {getAspectRatioString(
                                    Number(variant.width),
                                    Number(variant.height),
                                  )}
                                </span>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        {arr.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => field.removeValue(i)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>

                      <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
                        <form.Field name={`variants[${i}].label`}>
                          {(subField) => {
                            const isInvalid =
                              subField.state.meta.isTouched && !subField.state.meta.isValid;

                            return (
                              <Field className="md:col-span-2" data-invalid={isInvalid}>
                                <FieldLabel htmlFor={subField.name}>Label</FieldLabel>
                                <Input
                                  id={subField.name}
                                  name={subField.name}
                                  value={subField.state.value}
                                  onBlur={subField.handleBlur}
                                  onChange={(e) => subField.handleChange(e.target.value)}
                                  aria-invalid={isInvalid}
                                  placeholder="e.g. Large Portrait"
                                  autoComplete="off"
                                />
                                <FieldError errors={subField.state.meta.errors} />
                              </Field>
                            );
                          }}
                        </form.Field>
                        <form.Field name={`variants[${i}].width`}>
                          {(subField) => {
                            const isInvalid =
                              subField.state.meta.isTouched && !subField.state.meta.isValid;

                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={subField.name}>Width (px)</FieldLabel>
                                <Input
                                  type="number"
                                  id={subField.name}
                                  name={subField.name}
                                  value={subField.state.value}
                                  onBlur={subField.handleBlur}
                                  onChange={(e) => subField.handleChange(e.target.value)}
                                  aria-invalid={isInvalid}
                                />
                                <FieldError errors={subField.state.meta.errors} />
                              </Field>
                            );
                          }}
                        </form.Field>
                        <form.Field name={`variants[${i}].height`}>
                          {(subField) => {
                            const isInvalid =
                              subField.state.meta.isTouched && !subField.state.meta.isValid;

                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={subField.name}>Height (px)</FieldLabel>
                                <Input
                                  type="number"
                                  id={subField.name}
                                  name={subField.name}
                                  value={subField.state.value}
                                  onBlur={subField.handleBlur}
                                  onChange={(e) => subField.handleChange(e.target.value)}
                                  aria-invalid={isInvalid}
                                />
                                <FieldError errors={subField.state.meta.errors} />
                              </Field>
                            );
                          }}
                        </form.Field>
                        <form.Field name={`variants[${i}].format`}>
                          {(subField) => {
                            const isInvalid =
                              subField.state.meta.isTouched && !subField.state.meta.isValid;

                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldContent>
                                  <FieldLabel htmlFor={subField.name}>Format</FieldLabel>
                                  <FieldError errors={subField.state.meta.errors} />
                                </FieldContent>
                                <Select
                                  value={subField.state.value}
                                  onValueChange={(val) => {
                                    subField.handleChange(val as PortraitExportFormat);
                                  }}
                                >
                                  <SelectTrigger id={subField.name} aria-invalid={isInvalid}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem value="png">PNG</SelectItem>
                                      <SelectItem value="jpeg">JPEG</SelectItem>
                                      <SelectItem value="webp">WEBP</SelectItem>
                                      <SelectItem value="bmp">BMP</SelectItem>
                                      <SelectItem value="tga">TGA</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </Field>
                            );
                          }}
                        </form.Field>
                        <form.Field name={`variants[${i}].filename`}>
                          {(subField) => {
                            const isInvalid =
                              subField.state.meta.isTouched && !subField.state.meta.isValid;

                            return (
                              <Field className="md:col-span-2" data-invalid={isInvalid}>
                                <FieldLabel htmlFor={subField.name}>
                                  Filename Suffix / Override
                                </FieldLabel>
                                <Input
                                  id={subField.name}
                                  name={subField.name}
                                  value={subField.state.value}
                                  onBlur={subField.handleBlur}
                                  onChange={(e) => subField.handleChange(e.target.value)}
                                  aria-invalid={isInvalid}
                                  placeholder="e.g. _L (appends to portrait name)"
                                  autoComplete="off"
                                />
                                <FieldError errors={subField.state.meta.errors} />
                              </Field>
                            );
                          }}
                        </form.Field>
                      </FieldGroup>
                    </FieldSet>
                  ))}
                </div>
              </section>
            </Panel>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit]}>
          {([canSubmit]) => (
            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" size="lg" asChild>
                <Link href="/">Cancel</Link>
              </Button>
              <Button type="submit" size="lg" disabled={!canSubmit}>
                {mode === "create" ? "Save and Continue" : "Save Changes"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}

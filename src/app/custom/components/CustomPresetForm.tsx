"use client";

import {
  Form,
  FormField,
  FormFieldControl,
  FormFieldDescription,
  FormFieldError,
  FormFieldLabel,
  FormGlobalError,
  FormSubmitButton,
  useAppForm,
} from "@/components/Form";
import { Button } from "@/components/ui/Button";
import { FieldContent, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/Field";
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
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import * as v from "valibot";

const presetVariantInputSchema = v.object({
  label: v.pipe(v.string(), v.trim(), v.minLength(1, "Label is required")),
  width: v.pipe(v.string(), v.transform(Number), v.minValue(1, "Must be at least 1")),
  height: v.pipe(v.string(), v.transform(Number), v.minValue(1, "Must be at least 1")),
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

type PresetVariantInput = v.InferInput<typeof presetVariantInputSchema>;
type PresetInput = Omit<v.InferInput<typeof presetInputSchema>, "variants"> & {
  variants: PresetVariantInput[];
};

const getDefaultVariant = (): PresetVariantInput => ({
  label: "Portrait",
  width: "256",
  height: "256",
  format: "png",
  filename: "{name}",
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

  const form = useAppForm({
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
          if (finalFilename.endsWith(`.${v.format}`)) {
            finalFilename = finalFilename.slice(0, -(v.format.length + 1));
          }

          if (parsedValue.wrapInFolder) {
            finalFilename = finalFilename.replace(/\{name\}/g, "").trim();
            if (!finalFilename) {
              finalFilename = v.label.replace(/[^a-zA-Z0-9.\-_ ]/g, "").replace(/\s+/g, "_");
            }
          } else {
            if (finalFilename) {
              if (!finalFilename.includes("{name}")) {
                finalFilename = `{name}${finalFilename}`;
              }
            } else {
              finalFilename = `{name}`;
            }
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

      <form.AppForm>
        <Form className="flex flex-col gap-8">
          <Panel asChild>
            <section>
              <h2 className="font-display text-xl font-bold">General Settings</h2>
              <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <form.AppField name="name">
                  {(field) => (
                    <FormField className="md:col-span-2">
                      <FormFieldLabel>Preset Name</FormFieldLabel>
                      <FormFieldControl>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g. Arcanum"
                          autoComplete="off"
                        />
                      </FormFieldControl>
                      <FormFieldError />
                    </FormField>
                  )}
                </form.AppField>
                <form.AppField name="defaultName">
                  {(field) => (
                    <FormField className="md:col-span-2">
                      <FormFieldLabel>Default Portrait Name</FormFieldLabel>
                      <FormFieldControl>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g. PORTRAIT"
                          autoComplete="off"
                        />
                      </FormFieldControl>
                      <FormFieldError />
                    </FormField>
                  )}
                </form.AppField>
                <form.AppField name="maxLength">
                  {(field) => (
                    <FormField>
                      <FormFieldLabel>Max Filename Length (Optional)</FormFieldLabel>
                      <FormFieldControl>
                        <Input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          autoComplete="off"
                        />
                      </FormFieldControl>
                      <FormFieldError errors={field.state.meta.errors} />
                    </FormField>
                  )}
                </form.AppField>
                <form.AppField name="wrapInFolder">
                  {(field) => (
                    <FormField orientation="horizontal" className="col-start-3 row-start-1">
                      <FieldContent>
                        <FormFieldLabel>Wrap in Folder</FormFieldLabel>
                        <FormFieldDescription>
                          Places the images inside a folder in the ZIP.
                        </FormFieldDescription>
                        <FormFieldError />
                      </FieldContent>
                      <FormFieldControl>
                        <Switch
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                          onBlur={field.handleBlur}
                          className="my-auto"
                        />
                      </FormFieldControl>
                    </FormField>
                  )}
                </form.AppField>
              </FieldGroup>
            </section>
          </Panel>

          <form.AppField name="variants" mode="array">
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
                        <div className="flex min-h-10 items-center gap-4">
                          <FieldLegend className="mb-0 font-bold text-muted-foreground">
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
                          {arr.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => field.removeValue(i)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>

                        <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                          <form.AppField name={`variants[${i}].label`}>
                            {(subField) => (
                              <FormField className="col-span-2 md:col-span-2">
                                <FormFieldLabel>Label</FormFieldLabel>
                                <FormFieldControl>
                                  <Input
                                    name={subField.name}
                                    value={subField.state.value}
                                    onBlur={subField.handleBlur}
                                    onChange={(e) => subField.handleChange(e.target.value)}
                                    placeholder="e.g. Large Portrait"
                                    autoComplete="off"
                                  />
                                </FormFieldControl>
                                <FormFieldError />
                              </FormField>
                            )}
                          </form.AppField>
                          <form.AppField name={`variants[${i}].width`}>
                            {(subField) => (
                              <FormField>
                                <FormFieldLabel>Width (px)</FormFieldLabel>
                                <FormFieldControl>
                                  <Input
                                    type="number"
                                    name={subField.name}
                                    value={subField.state.value}
                                    onBlur={subField.handleBlur}
                                    onChange={(e) => subField.handleChange(e.target.value)}
                                  />
                                </FormFieldControl>
                                <FormFieldError />
                              </FormField>
                            )}
                          </form.AppField>
                          <form.AppField name={`variants[${i}].height`}>
                            {(subField) => (
                              <FormField>
                                <FormFieldLabel>Height (px)</FormFieldLabel>
                                <FormFieldControl>
                                  <Input
                                    type="number"
                                    name={subField.name}
                                    value={subField.state.value}
                                    onBlur={subField.handleBlur}
                                    onChange={(e) => subField.handleChange(e.target.value)}
                                  />
                                </FormFieldControl>
                                <FormFieldError />
                              </FormField>
                            )}
                          </form.AppField>
                          <form.AppField name={`variants[${i}].format`}>
                            {(subField) => (
                              <FormField>
                                <FieldContent>
                                  <FormFieldLabel>Format</FormFieldLabel>
                                  <FormFieldError />
                                </FieldContent>
                                <Select
                                  value={subField.state.value}
                                  onValueChange={(val) => {
                                    subField.handleChange(val as PortraitExportFormat);
                                  }}
                                >
                                  <FormFieldControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormFieldControl>
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
                              </FormField>
                            )}
                          </form.AppField>
                          <form.Subscribe selector={(state) => state.values.wrapInFolder}>
                            {(wrapInFolder) => (
                              <form.AppField name={`variants[${i}].filename`}>
                                {(subField) => (
                                  <FormField className="md:col-span-3">
                                    <FieldContent>
                                      <FormFieldLabel>Filename Base</FormFieldLabel>
                                      <FormFieldDescription>
                                        {wrapInFolder
                                          ? "Folder acts as name. E.g. 'Large' -> 'Bob/Large.png'"
                                          : "Use {name} token. E.g. '{name}_L' -> 'Bob_L.png'"}
                                      </FormFieldDescription>
                                    </FieldContent>
                                    <FormFieldControl>
                                      <Input
                                        name={subField.name}
                                        value={subField.state.value}
                                        onBlur={subField.handleBlur}
                                        onChange={(e) => subField.handleChange(e.target.value)}
                                        placeholder={
                                          wrapInFolder ? "e.g. Fulllength" : "e.g. {name}_L"
                                        }
                                        autoComplete="off"
                                      />
                                    </FormFieldControl>
                                    <FormFieldError />
                                  </FormField>
                                )}
                              </form.AppField>
                            )}
                          </form.Subscribe>
                        </FieldGroup>
                      </FieldSet>
                    ))}
                  </div>
                </section>
              </Panel>
            )}
          </form.AppField>

          <FormGlobalError>
            {(errors) => (
              <Panel className="border-destructive/50 bg-destructive/10 p-4 text-center">
                <p className="font-medium text-destructive">{errors.join(", ")}</p>
              </Panel>
            )}
          </FormGlobalError>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" size="lg" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <FormSubmitButton size="lg">
              {mode === "create" ? "Save and Continue" : "Save Changes"}
            </FormSubmitButton>
          </div>
        </Form>
      </form.AppForm>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/Button";
import { Field, FieldError, FieldLabel } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Panel } from "@/components/ui/Panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { PortraitVariant, Preset } from "@/data/presets";
import { useValidation } from "@/hooks/useValidation";
import { getAspectRatioString } from "@/lib/math";
import { useCustomPresetsStore } from "@/store/useCustomPresetsStore";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as v from "valibot";

const presetSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Preset name is required")),
  variants: v.pipe(
    v.array(
      v.object({
        label: v.pipe(v.string(), v.minLength(1, "Label is required")),
        width: v.pipe(
          v.union([v.number(), v.string()]),
          v.transform(Number),
          v.minValue(1, "Must be > 0"),
        ),
        height: v.pipe(
          v.union([v.number(), v.string()]),
          v.transform(Number),
          v.minValue(1, "Must be > 0"),
        ),
      }),
    ),
    v.minLength(1, "At least one variant is required"),
  ),
});

export default function CreateCustomPresetPage() {
  const router = useRouter();
  const { addCustomPreset } = useCustomPresetsStore();
  const { errors, validate, clearError } = useValidation(presetSchema);

  const [name, setName] = useState("");
  const [defaultName, setDefaultName] = useState("custom_portrait");
  const [wrapInFolder, setWrapInFolder] = useState(false);
  const [maxLength, setMaxLength] = useState<number | "">("");

  const [variants, setVariants] = useState<
    Array<{
      id: string;
      label: string;
      width: number | "";
      height: number | "";
      filename: string;
      format: PortraitVariant["format"];
    }>
  >([
    {
      id: crypto.randomUUID(),
      label: "Main Portrait",
      width: 256,
      height: 256,
      filename: "",
      format: "png",
    },
  ]);

  const handleAddVariant = () => {
    setVariants([
      {
        id: crypto.randomUUID(),
        label: "",
        width: "",
        height: "",
        filename: "",
        format: "png",
      },
      ...variants,
    ]);
    clearError("variants");
  };

  const handleRemoveVariant = (index: number, id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
    clearError(`variants.${index}.label`);
    clearError(`variants.${index}.width`);
    clearError(`variants.${index}.height`);
  };

  const updateVariant = (index: number, id: string, field: string, value: string | number) => {
    setVariants(
      variants.map((v) => {
        if (v.id === id) {
          return { ...v, [field]: value };
        }
        return v;
      }),
    );
    clearError(`variants.${index}.${field}`);
  };

  const handleSave = (e: React.SubmitEvent) => {
    e.preventDefault();

    const isValid = validate({ name: name.trim(), variants });
    if (!isValid) {
      return;
    }

    const presetId = `custom-${crypto.randomUUID()}`;

    const newPreset: Preset = {
      id: presetId,
      name: name.trim(),
      exportConfig: {
        wrapInFolder,
        defaultName: defaultName.trim(),
        maxLength: maxLength === "" ? undefined : Number(maxLength),
      },
      variants: variants.map((v, i) => {
        let finalFilename = v.filename.trim();
        if (finalFilename) {
          if (!finalFilename.includes("{name}")) {
            finalFilename = `{name}${finalFilename}.${v.format}`;
          }
        } else {
          finalFilename = `{name}.${v.format}`;
        }

        return {
          key: `variant-${i}`,
          label: v.label.trim(),
          width: Number(v.width),
          height: Number(v.height),
          format: v.format,
          filename: finalFilename,
        };
      }),
    };

    addCustomPreset(newPreset);
    router.push(`/create/${presetId}/select`);
  };

  return (
    <div className="container mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 md:py-24">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">
          Create Custom Preset
        </h1>
        <p className="text-lg text-muted-foreground">
          Define the exact dimensions required by your game or mod.
        </p>
      </header>

      <form onSubmit={handleSave} className="flex flex-col gap-8" noValidate>
        <Panel asChild>
          <section>
            <h2 className="font-display text-xl font-bold">General Settings</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="preset-name">Preset Name</FieldLabel>
                <Input
                  id="preset-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                  }}
                  placeholder="e.g. Arcanum"
                  aria-invalid={!!errors["name"]}
                />
                <FieldError errors={errors["name"]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="default-name">Default Portrait Name</FieldLabel>
                <Input
                  id="default-name"
                  value={defaultName}
                  onChange={(e) => setDefaultName(e.target.value)}
                  placeholder="e.g. PORTRAIT"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="max-length">Max Filename Length (Optional)</FieldLabel>
                <Input
                  id="max-length"
                  type="number"
                  value={maxLength}
                  onChange={(e) =>
                    setMaxLength(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="e.g. 8"
                  min={1}
                />
              </Field>

              <Field className="flex-row items-center justify-between rounded-lg">
                <div className="space-y-0.5">
                  <FieldLabel className="text-base" htmlFor="wrap-folder">
                    Wrap in Folder
                  </FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Places the images inside a folder in the ZIP.
                  </p>
                </div>
                <Switch id="wrap-folder" checked={wrapInFolder} onCheckedChange={setWrapInFolder} />
              </Field>
            </div>
          </section>
        </Panel>

        <Panel asChild>
          <section>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="font-display text-xl font-bold">Portrait Variants</h2>
                {errors["variants"] && (
                  <span className="text-sm font-medium text-destructive">{errors["variants"]}</span>
                )}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
                <Plus className="mr-1 size-5" />
                Add Variant
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              {variants.map((variant, index) => (
                <fieldset
                  key={variant.id}
                  className="flex flex-col gap-4 rounded-lg border border-border/50 bg-background/50 p-4"
                >
                  <div className="flex min-h-10 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <legend className="font-bold text-muted-foreground">
                        Variant {variants.length - index}
                      </legend>
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
                              {getAspectRatioString(variant.width, variant.height)}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    {variants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleRemoveVariant(index, variant.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor={`label-${variant.id}`}>Label</FieldLabel>
                      <Input
                        id={`label-${variant.id}`}
                        value={variant.label}
                        onChange={(e) => updateVariant(index, variant.id, "label", e.target.value)}
                        placeholder="e.g. Large Portrait"
                        aria-invalid={!!errors[`variants.${index}.label`]}
                      />
                      <FieldError errors={errors[`variants.${index}.label`]} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`width-${variant.id}`}>Width (px)</FieldLabel>
                      <Input
                        id={`width-${variant.id}`}
                        type="number"
                        value={variant.width}
                        onChange={(e) => updateVariant(index, variant.id, "width", e.target.value)}
                        placeholder="256"
                        min={1}
                        aria-invalid={!!errors[`variants.${index}.width`]}
                      />
                      <FieldError errors={errors[`variants.${index}.width`]} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`height-${variant.id}`}>Height (px)</FieldLabel>
                      <Input
                        id={`height-${variant.id}`}
                        type="number"
                        value={variant.height}
                        onChange={(e) => updateVariant(index, variant.id, "height", e.target.value)}
                        placeholder="256"
                        min={1}
                        aria-invalid={!!errors[`variants.${index}.height`]}
                      />
                      <FieldError errors={errors[`variants.${index}.height`]} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`format-${variant.id}`}>Format</FieldLabel>
                      <Select
                        value={variant.format}
                        onValueChange={(val) => updateVariant(index, variant.id, "format", val)}
                      >
                        <SelectTrigger id={`format-${variant.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="webp">WEBP</SelectItem>
                          <SelectItem value="bmp">BMP</SelectItem>
                          <SelectItem value="tga">TGA</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor={`suffix-${variant.id}`}>
                        Filename Suffix / Override
                      </FieldLabel>
                      <Input
                        id={`suffix-${variant.id}`}
                        value={variant.filename}
                        onChange={(e) =>
                          updateVariant(index, variant.id, "filename", e.target.value)
                        }
                        placeholder="e.g. _L (appends to portrait name)"
                      />
                    </Field>
                  </div>
                </fieldset>
              ))}
            </div>
          </section>
        </Panel>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" size="lg" asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <Button type="submit" size="lg">
            Save and Continue
          </Button>
        </div>
      </form>
    </div>
  );
}

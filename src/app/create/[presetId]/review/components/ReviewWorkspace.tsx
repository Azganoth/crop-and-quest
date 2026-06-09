"use client";

import { PortraitPreviewCard } from "@/app/create/components/PortraitPreviewCard";
import {
  Form,
  FormField,
  FormFieldControl,
  FormFieldError,
  FormFieldLabel,
  FormSubmitButton,
  useAppForm,
} from "@/components/Form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import { Field, FieldTitle } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Panel } from "@/components/ui/Panel";
import { Separator } from "@/components/ui/Separator";
import { Switch } from "@/components/ui/Switch";
import { Preset } from "@/data/presets";
import { useMounted } from "@/hooks/useMounted";
import { generatePresetZip, resolveVariantFilename, triggerDownload } from "@/lib/export";
import { usePortraitStore } from "@/store/usePortraitStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { ROUTES } from "@/lib/routes";
import { FileArchive, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import * as v from "valibot";

const buildPortraitNameSchema = (maxLength: number) =>
  v.object({
    portraitName: v.pipe(
      v.string(),
      v.trim(),
      v.regex(
        /^[a-zA-Z0-9.\-_ ]*$/,
        "Invalid characters (only letters, numbers, spaces, dots, dashes, and underscores)",
      ),
      v.minLength(1, "Portrait name is required"),
      v.maxLength(maxLength, `Max length is ${maxLength} characters`),
    ),
  });

export function ReviewWorkspace({ preset }: { preset: Preset }) {
  const router = useRouter();

  const { crops, clearSession } = usePortraitStore();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { isUniformMode, setUniformMode } = useSettingsStore();
  const isMounted = useMounted();

  const portraitNameSchema = useMemo(
    () => buildPortraitNameSchema(preset.exportConfig.maxLength || 50),
    [preset.exportConfig.maxLength],
  );

  const form = useAppForm({
    defaultValues: { portraitName: preset.exportConfig.defaultName },
    validators: {
      onChange: portraitNameSchema,
    },
    onSubmit: async ({ value }) => {
      const parsedValue = v.parse(portraitNameSchema, value);

      try {
        const zipBlob = await generatePresetZip(preset, crops, parsedValue.portraitName);
        const url = URL.createObjectURL(zipBlob);

        const a = document.createElement("a");
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revoking the object URL to prevent memory leaks from untracked blob references.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) {
        console.error(error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to generate ZIP file. Please download individual files instead.";
        setError(message);
      }
    },
  });

  const downloadName = `${preset.id}-portraits.zip`;

  const handleStartOver = () => {
    startTransition(() => {
      clearSession();
      router.push(ROUTES.create.select(preset.id));
    });
  };

  return (
    <section
      aria-label="Review and Export"
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-8 pt-8 pb-28"
    >
      <header className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <h1 className="font-display text-2xl font-bold text-primary">
            Review <span className="underline underline-offset-4">{preset.name}</span> Portraits
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {Object.keys(crops).length} of {preset.variants.length} completed
          </p>
        </div>
        <Button variant="outline" onClick={handleStartOver} disabled={isPending}>
          <RefreshCw className="mr-1 size-5" />
          {isPending ? "Starting Over..." : "Start Over"}
        </Button>
      </header>
      <div className="mt-6 flex flex-wrap items-start justify-center gap-8">
        {preset.variants
          .toSorted((a, b) => a.height - b.height)
          .map((variant) => (
            <PortraitPreviewCard
              key={variant.key}
              presetId={preset.id}
              variant={variant}
              cropUrl={crops[variant.key]?.croppedBlobUrl}
              isUniformMode={isUniformMode}
              onDownload={(cropUrl) => {
                const result = v.safeParse(portraitNameSchema, form.state.values);
                const safeName = result.success
                  ? result.output.portraitName
                  : preset.exportConfig.defaultName;
                const filename = resolveVariantFilename(variant, safeName);
                triggerDownload(cropUrl, filename);
              }}
            />
          ))}
      </div>
      <Field
        orientation="horizontal"
        className="mx-auto w-fit rounded-lg border border-border/50 bg-secondary/30 px-4 py-3"
      >
        <FieldTitle>Uniform Cards</FieldTitle>
        {isMounted && (
          <Switch
            aria-label="Uniform Cards"
            checked={isUniformMode}
            onCheckedChange={setUniformMode}
          />
        )}
      </Field>
      <form.AppForm>
        <Form className="sticky bottom-4 z-50 mx-auto w-full max-w-4xl pt-6 pb-2">
          <Panel className="flex flex-col items-center justify-between gap-4 bg-background/95 px-6 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] backdrop-blur supports-backdrop-filter:bg-background/80 md:flex-row dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
            <form.AppField name="portraitName">
              {(field) => (
                <FormField orientation="horizontal" className="w-auto gap-4">
                  <FormFieldLabel>Portrait Name</FormFieldLabel>
                  <div className="relative flex flex-col">
                    <FormFieldControl>
                      <Input
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-48 bg-background font-mono"
                        placeholder={preset.exportConfig.defaultName}
                        autoComplete="off"
                      />
                    </FormFieldControl>
                    <FormFieldError className="absolute top-full mt-1" />
                  </div>
                </FormField>
              )}
            </form.AppField>
            <FormSubmitButton
              disabled={Object.keys(crops).length !== preset.variants.length}
              size="lg"
              className="w-full shadow-lg md:w-auto"
            >
              <FileArchive className="mr-1 size-5" />
              Download All
            </FormSubmitButton>
          </Panel>
        </Form>
      </form.AppForm>
      <Separator className="my-12" />
      {preset.installNotes && (
        <Panel className="mx-auto w-full max-w-4xl">
          <h2 className="font-display text-lg font-bold text-foreground">Installation Notes</h2>
          <div className="flex flex-col gap-2 [&_p]:leading-relaxed [&_pre]:mt-1 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-border/50 [&_pre]:bg-background/80 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:break-all [&_pre]:whitespace-pre-wrap [&_pre]:text-muted-foreground [&_strong]:text-foreground">
            {preset.installNotes}
          </div>
        </Panel>
      )}
      <AlertDialog open={!!error} onOpenChange={(open) => !open && setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export Failed</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError(null)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

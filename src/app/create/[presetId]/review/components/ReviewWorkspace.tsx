"use client";

import { PortraitPreviewCard } from "@/app/create/components/PortraitPreviewCard";
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
import { Field, FieldError, FieldLabel, FieldTitle } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Panel } from "@/components/ui/Panel";
import { Separator } from "@/components/ui/Separator";
import { Switch } from "@/components/ui/Switch";
import { Preset } from "@/data/presets";
import { useMounted } from "@/hooks/useMounted";
import { generatePresetZip } from "@/lib/export";
import { usePortraitStore } from "@/store/usePortraitStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useForm } from "@tanstack/react-form";
import { FileArchive, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
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
      v.maxLength(maxLength, `Max length is ${maxLength} characters`),
    ),
  });

export function ReviewWorkspace({ preset }: { preset: Preset }) {
  const router = useRouter();

  const { crops, clearSession } = usePortraitStore();
  const [zipBlobUrl, setZipBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { isUniformMode, setUniformMode } = useSettingsStore();
  const isMounted = useMounted();

  useEffect(() => {
    if (zipBlobUrl) {
      URL.revokeObjectURL(zipBlobUrl);
      setZipBlobUrl(null);
    }
  }, [crops, zipBlobUrl]);

  // Revoking the object URL on unmount prevents memory leaks from untracked blob references.
  useEffect(
    () => () => {
      if (zipBlobUrl) URL.revokeObjectURL(zipBlobUrl);
    },
    [zipBlobUrl],
  );

  const portraitNameSchema = useMemo(
    () => buildPortraitNameSchema(preset.exportConfig.maxLength || 50),
    [preset.exportConfig.maxLength],
  );

  const form = useForm({
    defaultValues: { portraitName: preset.exportConfig.defaultName },
    validators: {
      onChange: portraitNameSchema,
    },
    onSubmit: async ({ value }) => {
      if (zipBlobUrl) {
        const a = document.createElement("a");
        a.href = zipBlobUrl;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      try {
        const zipBlob = await generatePresetZip(preset, crops, value.portraitName);
        const url = URL.createObjectURL(zipBlob);
        setZipBlobUrl(url);

        const a = document.createElement("a");
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error(error);
        const msg =
          error instanceof Error
            ? error.message
            : "Failed to generate ZIP file. Please download individual files instead.";
        setErrorMsg(msg);
      }
    },
  });

  const downloadName = `${preset.id}-portraits.zip`;

  const handleStartOver = () => {
    startTransition(() => {
      clearSession();
      router.push(`/create/${preset.id}/select`);
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
      <Separator className="my-3" />
      <div className="flex flex-wrap items-start justify-center gap-8">
        {preset.variants
          .toSorted((a, b) => a.height - b.height)
          .map((variant) => (
            <PortraitPreviewCard
              key={variant.key}
              presetId={preset.id}
              variant={variant}
              crop={crops[variant.key]}
              isUniformMode={isUniformMode}
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
      <form
        className="sticky bottom-4 z-50 mx-auto w-full max-w-4xl pt-6 pb-2"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Panel className="flex flex-col items-center justify-between gap-4 bg-background/95 px-6 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] backdrop-blur supports-backdrop-filter:bg-background/80 md:flex-row dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
          <form.Field name="portraitName">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field orientation="horizontal" className="w-auto" data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Portrait Name</FieldLabel>
                  <div className="relative flex flex-col">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      className="w-48 bg-background font-mono"
                      placeholder={preset.exportConfig.defaultName}
                      autoComplete="off"
                    />
                    <FieldError
                      className="absolute top-full mt-1"
                      errors={field.state.meta.errors}
                    />
                  </div>
                </Field>
              );
            }}
          </form.Field>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || Object.keys(crops).length !== preset.variants.length}
                size="lg"
                className="w-full shadow-lg md:w-auto"
              >
                {isSubmitting ? (
                  "Packaging..."
                ) : (
                  <>
                    <FileArchive className="mr-1 size-5" />
                    Download All
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </Panel>
      </form>

      <Separator className="my-12" />

      {preset.installNotes && (
        <Panel className="mx-auto w-full max-w-4xl">
          <h2 className="font-display text-lg font-bold text-foreground">Installation Notes</h2>
          <div className="flex flex-col gap-2 [&_p]:leading-relaxed [&_pre]:mt-1 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-border/50 [&_pre]:bg-background/80 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:break-all [&_pre]:whitespace-pre-wrap [&_pre]:text-muted-foreground [&_strong]:text-foreground">
            {preset.installNotes}
          </div>
        </Panel>
      )}

      <AlertDialog open={!!errorMsg} onOpenChange={(open) => !open && setErrorMsg(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export Failed</AlertDialogTitle>
            <AlertDialogDescription>{errorMsg}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMsg(null)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

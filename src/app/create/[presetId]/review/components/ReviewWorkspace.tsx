"use client";

import { PortraitPreviewCard } from "@/app/create/components/PortraitPreviewCard";
import { Button } from "@/components/ui/Button";
import { Field, FieldError, FieldLabel } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Panel } from "@/components/ui/Panel";
import { Separator } from "@/components/ui/Separator";
import { Switch } from "@/components/ui/Switch";
import { Preset } from "@/data/presets";
import { useMounted } from "@/hooks/useMounted";
import { generatePresetZip } from "@/lib/export";
import { usePortraitStore } from "@/store/usePortraitStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { FileArchive, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";

export function ReviewWorkspace({ preset }: { preset: Preset }) {
  const router = useRouter();

  const { crops, clearSession } = usePortraitStore();
  const [zipBlobUrl, setZipBlobUrl] = useState<string | null>(null);
  const [portraitName, setPortraitName] = useState(preset.exportConfig.defaultName);
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
  useEffect(() => {
    return () => {
      if (zipBlobUrl) URL.revokeObjectURL(zipBlobUrl);
    };
  }, [zipBlobUrl]);

  const safePortraitName = portraitName.trim() || preset.exportConfig.defaultName;
  const downloadName = `${preset.id}-portraits.zip`;

  const [, formAction, isExporting] = useActionState(async () => {
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
      const zipBlob = await generatePresetZip(preset, crops, safePortraitName);
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
      alert(msg);
    }
  }, null);

  const handleStartOver = () => {
    startTransition(() => {
      clearSession();
      router.push(`/create/${preset.id}/select`);
    });
  };

  return (
    <section
      aria-label="Review and Export"
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-8 pt-8 pb-20"
    >
      <header className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-center font-display text-4xl font-bold md:text-5xl">
            Review {preset.name} Portraits
          </h1>
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {Object.keys(crops).length} of {preset.variants.length} completed
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Label htmlFor="view-mode" className="cursor-pointer font-medium text-muted-foreground">
              Uniform Cards
            </Label>
            {isMounted && (
              <Switch id="view-mode" checked={isUniformMode} onCheckedChange={setUniformMode} />
            )}
          </div>
          <Separator orientation="vertical" className="hidden h-8 md:block" />
          <Button variant="outline" onClick={handleStartOver} disabled={isPending}>
            <RefreshCw className="mr-2 size-4" />
            {isPending ? "Starting Over..." : "Start Over"}
          </Button>
        </div>
      </header>

      <Separator className="my-3" />

      <div className="flex flex-wrap items-start justify-center gap-8">
        {preset.variants
          .toSorted((a, b) => a.height - b.height)
          .map((variant) => (
            <Link
              key={variant.key}
              href={`/create/${preset.id}/${variant.key}?singleEdit=true`}
              passHref
              legacyBehavior
            >
              <PortraitPreviewCard
                variant={variant}
                crop={crops[variant.key]}
                isUniformMode={isUniformMode}
              />
            </Link>
          ))}
      </div>

      <form className="sticky bottom-4 z-50 mx-auto w-full max-w-4xl pt-6 pb-2" action={formAction}>
        <Panel className="flex flex-col items-center justify-between gap-4 bg-background/95 px-6 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] backdrop-blur supports-backdrop-filter:bg-background/80 md:flex-row dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
          <Field orientation="horizontal" className="w-auto items-center gap-4">
            <FieldLabel
              htmlFor="portrait-name"
              className="font-medium whitespace-nowrap text-foreground"
            >
              Portrait Name
            </FieldLabel>
            <div className="relative flex flex-col">
              <Input
                id="portrait-name"
                value={portraitName}
                onChange={(e) => setPortraitName(e.target.value)}
                className="peer w-48 bg-background font-mono invalid:border-destructive invalid:ring-destructive/20"
                pattern="^[a-zA-Z0-9.\-_ ]*$"
                maxLength={preset.exportConfig.maxLength || 50}
                title={`Only letters, numbers, spaces, dots, dashes, and underscores are allowed. Max length: ${preset.exportConfig.maxLength || 50} characters.`}
              />
              <FieldError className="absolute top-full mt-1 hidden text-[11px] font-medium whitespace-nowrap text-destructive peer-invalid:block">
                Invalid characters
              </FieldError>
            </div>
          </Field>
          <Button
            type="submit"
            disabled={isExporting || Object.keys(crops).length !== preset.variants.length}
            size="lg"
            className="w-full shadow-lg md:w-auto"
          >
            {isExporting ? (
              "Packaging..."
            ) : (
              <>
                <FileArchive className="mr-2 size-5" />
                Download All
              </>
            )}
          </Button>
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
    </section>
  );
}

"use client";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { GAMES } from "@/data/games";
import { PortraitPreviewCard } from "@/features/generator/components/PortraitPreviewCard";
import { usePortraitStore } from "@/features/generator/store/usePortraitStore";
import { generateGameZip } from "@/features/generator/utils/export";
import { useMounted } from "@/hooks/useMounted";
import { useSettingsStore } from "@/store/useSettingsStore";
import { FileArchive, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState, useTransition } from "react";

export default function ReviewPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const router = useRouter();

  const game = GAMES.find((g) => g.id === gameId);
  const { crops, clearSession } = usePortraitStore();
  const [isExporting, setIsExporting] = useState(false);
  const [zipBlobUrl, setZipBlobUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { isUniformMode, setUniformMode } = useSettingsStore();
  const isMounted = useMounted();

  useEffect(() => {
    if (!game) {
      router.replace("/");
    }
  }, [game, router]);

  // Invalidate cached zip when crops change
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

  if (!game) return null;

  const isMissingRequired = game.variants.some(
    (variant) => !variant.optional && !crops[variant.key]?.croppedBlobUrl,
  );

  const handleDownloadZip = async () => {
    if (zipBlobUrl) {
      const a = document.createElement("a");
      a.href = zipBlobUrl;
      a.download = `${game.id}-portraits.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    try {
      setIsExporting(true);
      const zipBlob = await generateGameZip(game, crops);
      const url = URL.createObjectURL(zipBlob);
      setZipBlobUrl(url);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${game.id}-portraits.zip`;
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
    } finally {
      setIsExporting(false);
    }
  };

  const handleStartOver = () => {
    startTransition(() => {
      clearSession();
      router.push(`/create/${gameId}/select`);
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 border-b border-border/50 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary capitalize md:text-3xl">
              Review Portraits
            </h1>
            <p className="text-muted-foreground md:text-base">{game.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <Label
              htmlFor="view-mode"
              className="cursor-pointer text-sm font-medium text-muted-foreground"
            >
              Uniform Cards
            </Label>
            {isMounted && (
              <Switch id="view-mode" checked={isUniformMode} onCheckedChange={setUniformMode} />
            )}
          </div>

          <div className="hidden h-8 w-px bg-border/50 md:block" />

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleStartOver} disabled={isPending}>
              <RefreshCw className="mr-1 size-5" />
              {isPending ? "Starting Over..." : "Start Over"}
            </Button>
            <Button
              onClick={handleDownloadZip}
              disabled={isExporting || isMissingRequired || isPending}
              size="lg"
            >
              {isExporting ? (
                "Packaging..."
              ) : (
                <>
                  <FileArchive className="mr-1 size-5" />
                  Download All
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMissingRequired && !isPending && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          <strong>Cannot create ZIP:</strong> You must crop all non-optional portraits before
          generating a ZIP archive. Please click the Edit icon on the missing variants to complete
          them.
        </div>
      )}

      <div className="flex flex-wrap items-start justify-center gap-6">
        {game.variants
          .toSorted((a, b) => a.height - b.height)
          .map((variant) => (
            <PortraitPreviewCard
              key={variant.key}
              variant={variant}
              crop={crops[variant.key]}
              isUniformMode={isUniformMode}
            />
          ))}
      </div>
    </div>
  );
}

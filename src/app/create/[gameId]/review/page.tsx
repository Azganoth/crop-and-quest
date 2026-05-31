"use client";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Panel } from "@/components/ui/Panel";
import { Separator } from "@/components/ui/Separator";
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
  const { crops, clearSession, imageUrl } = usePortraitStore();
  const [isExporting, setIsExporting] = useState(false);
  const [zipBlobUrl, setZipBlobUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { isUniformMode, setUniformMode } = useSettingsStore();
  const isMounted = useMounted();

  useEffect(() => {
    if (!game) {
      router.replace("/");
    } else if (!imageUrl) {
      router.replace(`/create/${game.id}/select`);
    }
  }, [game, imageUrl, router]);

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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-8 pt-8 pb-20">
      <div className="flex flex-col items-center gap-4 md:justify-between lg:flex-row">
        <div className="mb-2 text-center lg:mb-0 lg:text-left">
          <h1 className="font-display text-2xl font-bold text-primary capitalize md:text-3xl">
            Review Portraits
          </h1>
          <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
            {game.name}
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

          <Separator orientation="vertical" className="hidden md:block" />

          <div className="flex items-center gap-6">
            <Button variant="outline" onClick={handleStartOver} disabled={isPending}>
              <RefreshCw className="mr-1 size-5" />
              {isPending ? "Starting Over..." : "Start Over"}
            </Button>
            <Button onClick={handleDownloadZip} disabled={isExporting || isPending} size="lg">
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

      <Separator className="my-3" />

      <div className="flex flex-wrap items-start justify-center gap-8">
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

      <Separator className="my-12" />

      {game.installNotes && (
        <Panel className="mx-auto w-full max-w-4xl">
          <h2 className="font-display text-lg font-bold text-foreground">Installation Notes</h2>
          <div className="flex flex-col gap-2 [&_p]:leading-relaxed [&_pre]:mt-1 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-border/50 [&_pre]:bg-background/80 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:break-all [&_pre]:whitespace-pre-wrap [&_pre]:text-muted-foreground [&_strong]:text-foreground">
            {game.installNotes}
          </div>
        </Panel>
      )}
    </div>
  );
}

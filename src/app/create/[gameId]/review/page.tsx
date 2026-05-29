"use client";

import { ArrowLeft, Download, FileArchive, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { GAMES } from "@/data/games";
import { generateGameZip, triggerDownload } from "@/lib/export";
import { usePortraitStore } from "@/store/usePortraitStore";

export default function ReviewPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const router = useRouter();

  const game = GAMES.find((g) => g.id === gameId);
  const { crops, clearSession } = usePortraitStore();
  const [isExporting, setIsExporting] = useState(false);
  const [zipBlobUrl, setZipBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!game) {
      router.replace("/");
    }
  }, [game, router]);

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
    clearSession();
    router.push("/");
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 border-b border-border/50 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="shrink-0" asChild>
            <Link href={`/create/${gameId}/select`} aria-label="Go back">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary capitalize md:text-3xl">
              Review Portraits
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">{game.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={handleStartOver}>
            <RefreshCw className="mr-2 size-4" />
            Start Over
          </Button>
          <Button
            onClick={handleDownloadZip}
            disabled={isExporting || isMissingRequired}
            size="lg"
            variant={zipBlobUrl ? "default" : "default"}
          >
            {isExporting ? (
              "Packaging..."
            ) : zipBlobUrl ? (
              <>
                <FileArchive className="mr-2 size-5" />
                Download ZIP Again
              </>
            ) : (
              <>
                <FileArchive className="mr-2 size-5" />
                Download All (ZIP)
              </>
            )}
          </Button>
        </div>
      </div>

      {isMissingRequired && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          <strong>Cannot create ZIP:</strong> You must crop all non-optional portraits before
          generating a ZIP archive. Please go back and complete the missing variants.
        </div>
      )}

      <div className="flex flex-wrap items-start justify-center gap-6">
        {game.variants.map((variant) => {
          const crop = crops[variant.key];
          const hasCrop = !!crop?.croppedBlobUrl;
          const isSmall = variant.width < 280;

          return (
            <div
              key={variant.key}
              className={`flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all ${
                !hasCrop && !variant.optional ? "border-destructive/50" : "border-border/50"
              } w-fit max-w-full min-w-70`}
            >
              <div
                className="group relative flex w-full items-center justify-center overflow-hidden bg-black/1"
                style={{
                  aspectRatio: `${variant.width} / ${variant.height}`,
                }}
              >
                <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]" />
                {hasCrop && isSmall && (
                  <>
                    <div
                      className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                      style={{ backgroundImage: `url(${crop.croppedBlobUrl})` }}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </>
                )}

                {hasCrop ? (
                  <Image
                    src={crop.croppedBlobUrl!}
                    alt={variant.label}
                    width={variant.width}
                    height={variant.height}
                    unoptimized
                    className={`relative z-10 transition-transform duration-300 hover:scale-105 ${
                      isSmall
                        ? "shadow-2xl ring-1 ring-white/10"
                        : "max-h-full max-w-full object-contain"
                    }`}
                    style={{
                      width: `${variant.width}px`,
                      height: `${variant.height}px`,
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
                    <span className="text-sm font-semibold">Not generated</span>
                    {variant.optional && (
                      <span className="mt-1 text-xs opacity-75">(Optional)</span>
                    )}
                    {!variant.optional && (
                      <span className="mt-1 text-xs font-medium text-destructive">(Required)</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-border/50 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-semibold text-primary">
                      {variant.label}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {variant.filename}
                    </p>
                  </div>
                  <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 font-mono text-xs font-medium text-secondary-foreground">
                    {variant.width}×{variant.height}px
                  </span>
                </div>

                {hasCrop && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-1 w-full"
                    onClick={() => triggerDownload(crop.croppedBlobUrl!, variant.filename)}
                  >
                    <Download className="mr-2 size-4" />
                    Download Portrait
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

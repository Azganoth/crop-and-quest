import { Button } from "@/components/ui/Button";
import type { PortraitVariant } from "@/data/presets";
import { cn } from "@/lib/cn";
import { Download, Edit2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PortraitPreviewCardProps {
  presetId: string;
  variant: PortraitVariant;
  cropUrl?: string;
  isUniformMode?: boolean;
  onDownload?: (cropUrl: string) => void;
}

export function PortraitPreviewCard({
  presetId,
  variant,
  cropUrl,
  isUniformMode,
  onDownload,
}: PortraitPreviewCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-b-xl border border-border/50 bg-card shadow-sm transition-all",
        isUniformMode ? "w-85" : "w-fit max-w-full min-w-70",
      )}
    >
      <figure
        className={cn(
          "group relative flex w-full items-center justify-center overflow-hidden bg-black/10",
          isUniformMode && "h-80",
        )}
        style={
          isUniformMode
            ? undefined
            : {
                aspectRatio: `${variant.width} / ${variant.height}`,
              }
        }
      >
        <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]" />
        {cropUrl && (
          <>
            <div
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
              style={{ backgroundImage: `url(${cropUrl})` }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </>
        )}

        {cropUrl ? (
          <Image
            src={cropUrl}
            alt={variant.label}
            width={variant.width}
            height={variant.height}
            unoptimized
            className={cn(
              "relative z-10 shadow-2xl transition-transform duration-300 group-hover:scale-(--hover-scale)",
              isUniformMode && "max-h-full max-w-full object-contain",
            )}
            style={
              isUniformMode
                ? { "--hover-scale": 1.05 }
                : {
                    width: `${variant.width}px`,
                    height: `${variant.height}px`,
                    "--hover-scale": 1 + 15 / variant.width,
                  }
            }
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
            <span className="font-semibold">Skipped</span>
            <Button variant="secondary" size="lg" className="mt-6" asChild>
              <Link href={`/create/${presetId}/${variant.key}?singleEdit=true`}>
                <Edit2 className="mr-1 size-5" />
                Crop Variant
              </Link>
            </Button>
          </div>
        )}
      </figure>

      <div className="flex flex-col gap-3 border-t border-border/50 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-primary">{variant.label}</h3>
          <span className="shrink-0 rounded-lg bg-secondary px-2 py-1 font-mono text-sm font-medium text-secondary-foreground">
            {variant.width}×{variant.height}
          </span>
        </div>

        {cropUrl && (
          <div className="mt-1 flex gap-3">
            <Button variant="outline" asChild>
              <Link href={`/create/${presetId}/${variant.key}?singleEdit=true`}>
                <Edit2 className="mr-1 size-5 shrink-0" />
                <span className="truncate">Edit</span>
              </Link>
            </Button>
            {onDownload && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onDownload(cropUrl);
                }}
              >
                <Download className="mr-1 size-5 shrink-0" />
                <span className="truncate">Download</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

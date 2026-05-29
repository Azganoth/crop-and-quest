import { Button } from "@/components/ui/Button";
import type { PortraitVariant } from "@/data/games";
import type { CropState } from "@/features/generator/store/usePortraitStore";
import { triggerDownload } from "@/features/generator/utils/export";
import { Download } from "lucide-react";
import Image from "next/image";

interface PortraitPreviewCardProps {
  variant: PortraitVariant;
  crop?: CropState;
}

export function PortraitPreviewCard({ variant, crop }: PortraitPreviewCardProps) {
  const hasCrop = !!crop?.croppedBlobUrl;
  const isSmall = variant.width < 280;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all ${
        !hasCrop && !variant.optional ? "border-destructive/50" : "border-border/50"
      } w-fit max-w-full min-w-70`}
    >
      <div
        className="group relative flex w-full items-center justify-center overflow-hidden bg-black/10"
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
              isSmall ? "shadow-2xl ring-1 ring-white/10" : "max-h-full max-w-full object-contain"
            }`}
            style={{
              width: `${variant.width}px`,
              height: `${variant.height}px`,
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
            <span className="text-sm font-semibold">Not generated</span>
            {variant.optional && <span className="mt-1 text-xs opacity-75">(Optional)</span>}
            {!variant.optional && (
              <span className="mt-1 text-xs font-medium text-destructive">(Required)</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border/50 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-semibold text-primary">{variant.label}</h3>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{variant.filename}</p>
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
}

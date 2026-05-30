import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import type { PortraitVariant } from "@/data/games";
import type { CropState } from "@/features/generator/store/usePortraitStore";
import { triggerDownload } from "@/features/generator/utils/export";
import { cn } from "@/lib/cn";
import { Download, Edit2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface PortraitPreviewCardProps {
  variant: PortraitVariant;
  crop?: CropState;
  isUniformMode?: boolean;
}

export function PortraitPreviewCard({ variant, crop, isUniformMode }: PortraitPreviewCardProps) {
  const hasCrop = !!crop?.croppedBlobUrl;
  const params = useParams<{ gameId: string }>();

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all",
        !hasCrop && !variant.optional ? "border-destructive/50" : "border-border/50",
        isUniformMode ? "w-86" : "w-fit max-w-full min-w-70",
      )}
    >
      <div
        className={cn(
          "group relative flex w-full items-center justify-center overflow-hidden bg-black/10",
          isUniformMode && "h-140",
        )}
        style={{
          aspectRatio: `${variant.width} / ${variant.height}`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]" />
        {hasCrop && (
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
            className={cn(
              "relative z-10 shadow-2xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-(--hover-scale)",
              isUniformMode && "h-full w-full object-contain",
            )}
            style={
              {
                width: `${variant.width}px`,
                height: `${variant.height}px`,
                "--hover-scale": 1 + 15 / variant.width,
              } as React.CSSProperties
            }
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
            <span className="font-semibold">Not cropped</span>
            {variant.optional ? (
              <span className="mt-1 opacity-75">(Optional)</span>
            ) : (
              <span className="mt-1 font-medium text-destructive">(Required)</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border/50 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-primary">{variant.label}</h3>
          <span className="shrink-0 rounded bg-secondary px-1.5 py-1 font-mono text-sm font-medium text-secondary-foreground">
            {variant.width}×{variant.height}px
          </span>
        </div>

        {hasCrop && (
          <div className="mt-1 flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon-lg" asChild>
                  <Link href={`/create/${params?.gameId}/${variant.key}?singleEdit=true`}>
                    <Edit2 className="size-5" />
                    <span className="sr-only">Edit variant</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit variant</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => triggerDownload(crop.croppedBlobUrl!, variant.filename)}
                >
                  <Download className="mr-1 size-5 shrink-0" />
                  <span className="truncate">{variant.filename}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download {variant.filename}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

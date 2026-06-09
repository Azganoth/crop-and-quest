"use client";

import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Separator } from "@/components/ui/Separator";
import type { PortraitVariant, Preset } from "@/data/presets";
import { exportCroppedImage } from "@/lib/canvas";
import { usePortraitStore } from "@/store/usePortraitStore";
import { ROUTES } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { RotationControl } from "./RotationControl";
import { MAX_ZOOM, ZoomControl } from "./ZoomControl";

interface CropperWorkspaceProps {
  preset: Preset;
  variant: PortraitVariant;
  variantIndex: number;
  totalVariants: number;
  nextVariant?: PortraitVariant;
  variantKey: string;
  isSingleEdit: boolean;
  imageUrl: string;
}

export function CropperWorkspace({
  preset,
  variant,
  variantIndex,
  totalVariants,
  nextVariant,
  variantKey,
  isSingleEdit,
  imageUrl,
}: CropperWorkspaceProps) {
  const router = useRouter();
  const { crops, setCrop } = usePortraitStore();

  const [crop, setCropState] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [imageResolution, setImageResolution] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    if (crops[variantKey]) {
      const saved = crops[variantKey]!;
      setCropState({ x: saved.x, y: saved.y });
      setZoom(saved.zoom);
      setRotation(saved.rotation);
    }
  }, [crops, variantKey]);

  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.onload = () => {
      if (isMounted) {
        setImageResolution({ width: img.naturalWidth, height: img.naturalHeight });
      }
    };
    img.src = imageUrl;

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  const handleZoom1to1 = () => {
    if (croppedAreaPixels) {
      const baseCropWidth = croppedAreaPixels.width * zoom;
      const targetZoom = baseCropWidth / variant.width;
      setZoom(Math.max(1, targetZoom));
    }
  };

  const handleCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    if (!imageUrl || !croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedBlobUrl = await exportCroppedImage(
        imageUrl,
        croppedAreaPixels,
        rotation,
        variant.width,
        variant.height,
        variant.format,
        variant.quality,
      );

      setCrop(variantKey, {
        x: crop.x,
        y: crop.y,
        zoom,
        rotation,
        croppedAreaPixels,
        croppedBlobUrl,
      });

      startTransition(() => {
        if (isSingleEdit) {
          router.push(ROUTES.create.review(preset.id));
        } else if (nextVariant) {
          router.push(ROUTES.create.crop(preset.id, nextVariant.key));
        } else {
          router.push(ROUTES.create.review(preset.id));
        }
      });
    } catch (e) {
      console.error(e);
      alert("Failed to process the image. Please try a different image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    startTransition(() => {
      if (isSingleEdit) {
        router.push(ROUTES.create.review(preset.id));
      } else if (nextVariant) {
        router.push(ROUTES.create.crop(preset.id, nextVariant.key));
      } else {
        router.push(ROUTES.create.review(preset.id));
      }
    });
  };

  const aspect = variant.width / variant.height;
  const previousVariant = variantIndex > 0 ? preset.variants[variantIndex - 1] : undefined;
  const backHref = isSingleEdit
    ? ROUTES.create.review(preset.id)
    : previousVariant
      ? ROUTES.create.crop(preset.id, previousVariant.key)
      : ROUTES.create.select(preset.id);

  return (
    <section
      aria-label="Crop Portrait"
      className="relative flex flex-1 flex-col overflow-hidden md:flex-row"
    >
      <div className="relative flex flex-1 items-center justify-center">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          onCropChange={setCropState}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          showGrid={true}
          zoomSpeed={0.2}
          maxZoom={MAX_ZOOM}
        />
      </div>
      <Panel asChild className="z-20 w-full md:m-6 md:w-80 md:shrink-0 lg:w-96">
        <aside>
          <header className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="shrink-0" asChild>
                <Link href={backHref} aria-label="Go back">
                  <ArrowLeft className="size-6" />
                </Link>
              </Button>
              <h1 className="font-display text-xl font-bold text-primary capitalize md:text-2xl">
                {variant.label}
              </h1>
            </div>
            {!isSingleEdit && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center text-sm font-medium tracking-wider text-muted-foreground uppercase">
                  Step {variantIndex + 1} of {totalVariants}
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: totalVariants }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i < variantIndex
                          ? "bg-primary/50"
                          : i === variantIndex
                            ? "bg-primary"
                            : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            <span className="text-center text-sm font-bold tracking-widest text-muted-foreground uppercase">
              {preset.name}
            </span>
          </header>

          <Separator />

          <div className="flex flex-1 flex-col gap-8">
            <ZoomControl zoom={zoom} onZoomChange={setZoom} onZoom1to1={handleZoom1to1} />
            <RotationControl rotation={rotation} onRotationChange={setRotation} />
            <p className="mt-auto space-x-2 text-center text-sm text-muted-foreground">
              <span>
                Target:{" "}
                <span className="font-medium text-foreground">
                  {variant.width}x{variant.height}
                </span>{" "}
                px
              </span>
              {imageResolution && (
                <>
                  <span>•</span>
                  <span>
                    Source:{" "}
                    <span className="font-medium text-foreground">
                      {imageResolution.width}x{imageResolution.height}
                    </span>{" "}
                    px
                  </span>
                </>
              )}
            </p>
          </div>

          <Separator />

          <nav aria-label="Cropper Actions" className="flex flex-col gap-3">
            <Button
              onClick={handleSave}
              disabled={isProcessing || isPending}
              size="lg"
              className="w-full text-base"
            >
              {isProcessing || isPending ? "Processing..." : isSingleEdit ? "Save" : "Save & Next"}
            </Button>
            {isSingleEdit ? (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleSkip}
                disabled={isProcessing || isPending}
                className="w-full text-base"
              >
                Cancel
              </Button>
            ) : (
              variant.optional && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleSkip}
                  disabled={isProcessing || isPending}
                  className="w-full text-base"
                >
                  Skip Variant
                </Button>
              )
            )}
          </nav>
        </aside>
      </Panel>
    </section>
  );
}

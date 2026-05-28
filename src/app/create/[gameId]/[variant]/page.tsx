"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { GAMES } from "@/data/games";
import { getCroppedImg } from "@/lib/canvas";
import { usePortraitStore } from "@/store/usePortraitStore";

export default function CropVariantPage({
  params,
}: {
  params: Promise<{ gameId: string; variant: string }>;
}) {
  const { gameId, variant: variantKey } = use(params);
  const router = useRouter();

  const { imageUrl, crops, setCrop } = usePortraitStore();

  const game = GAMES.find((g) => g.id === gameId);
  const variantIndex = game?.variants.findIndex((v) => v.key === variantKey) ?? -1;
  const variant = game?.variants[variantIndex];
  const nextVariant = game?.variants[variantIndex + 1];

  const [crop, setCropState] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (crops[variantKey]) {
      const saved = crops[variantKey]!;
      setCropState({ x: saved.x, y: saved.y });
      setZoom(saved.zoom);
      setRotation(saved.rotation);
    }
  }, [crops, variantKey]);

  useEffect(() => {
    if (!game || !variant) {
      router.replace(`/`);
    } else if (!imageUrl) {
      router.replace(`/create/${gameId}/select`);
    }
  }, [game, variant, imageUrl, gameId, router]);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    if (!imageUrl || !croppedAreaPixels || !variant) return;
    try {
      setIsProcessing(true);
      const croppedBlobUrl = await getCroppedImg(
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

      if (nextVariant) {
        router.push(`/create/${gameId}/${nextVariant.key}`);
      } else {
        router.push(`/create/${gameId}/review`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to process the image. Please try a different image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    if (nextVariant) {
      router.push(`/create/${gameId}/${nextVariant.key}`);
    } else {
      router.push(`/create/${gameId}/review`);
    }
  };

  if (!game || !variant || !imageUrl) {
    return null;
  }

  const aspect = variant.width / variant.height;
  const totalVariants = game?.variants.length || 0;

  return (
    <div className="relative flex flex-1 flex-col md:flex-row">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black/95">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          onCropChange={setCropState}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          showGrid={true}
          zoomSpeed={0.2}
        />
      </div>
      <div className="z-20 flex w-full flex-col border-l border-border/50 bg-card/80 backdrop-blur md:w-80 md:shrink-0 lg:w-96">
        <div className="flex flex-col gap-4 border-b border-border/50 p-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="shrink-0" asChild>
              <Link href={`/create/${gameId}/select`} aria-label="Go back">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="font-display text-xl font-bold text-primary capitalize md:text-2xl">
                {variant.label}
              </h1>
              <p className="text-xs text-muted-foreground md:text-sm">
                {variant.width}x{variant.height} px • Step {variantIndex + 1} of {totalVariants}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-8 p-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <Label>Zoom</Label>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
                  >
                    <ZoomOut className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom Out (-10%)</TooltipContent>
              </Tooltip>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.01}
                aria-label="Zoom"
                onValueChange={([val]) => setZoom(val)}
                className="flex-1"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                  >
                    <ZoomIn className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom In (+10%)</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <Label>Rotation</Label>
              <span className="text-sm font-medium text-muted-foreground">{rotation}°</span>
            </div>
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setRotation((r) => r - 5)}
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rotate Left (-5°)</TooltipContent>
              </Tooltip>
              <Slider
                value={[rotation]}
                min={-180}
                max={180}
                step={1}
                aria-label="Rotation"
                onValueChange={([val]) => setRotation(val)}
                className="flex-1"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setRotation((r) => r + 5)}
                  >
                    <RotateCw className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rotate Right (+5°)</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-border/50 p-6">
          <Button
            onClick={handleSave}
            disabled={isProcessing}
            size="lg"
            className="w-full text-base"
          >
            {isProcessing ? "Processing..." : "Save & Next"}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleSkip}
            disabled={isProcessing || !variant.optional}
            className="w-full text-base"
          >
            Skip Variant
          </Button>
        </div>
      </div>
    </div>
  );
}

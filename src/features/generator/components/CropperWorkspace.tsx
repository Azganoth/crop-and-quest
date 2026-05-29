"use client";

import { Button } from "@/components/ui/Button";
import type { GamePreset, PortraitVariant } from "@/data/games";
import { usePortraitStore } from "@/features/generator/store/usePortraitStore";
import { exportCroppedImage } from "@/lib/canvas";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { RotationControl } from "./RotationControl";
import { ZoomControl } from "./ZoomControl";

interface CropperWorkspaceProps {
  game: GamePreset;
  variant: PortraitVariant;
  variantIndex: number;
  totalVariants: number;
  nextVariant?: PortraitVariant;
  variantKey: string;
}

export function CropperWorkspace({
  game,
  variant,
  variantIndex,
  totalVariants,
  nextVariant,
  variantKey,
}: CropperWorkspaceProps) {
  const router = useRouter();
  const { imageUrl, crops, setCrop } = usePortraitStore();

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
    if (!imageUrl) {
      router.replace(`/create/${game.id}/select`);
    }
  }, [imageUrl, game.id, router]);

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

      if (nextVariant) {
        router.push(`/create/${game.id}/${nextVariant.key}`);
      } else {
        router.push(`/create/${game.id}/review`);
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
      router.push(`/create/${game.id}/${nextVariant.key}`);
    } else {
      router.push(`/create/${game.id}/review`);
    }
  };

  if (!imageUrl) return null;

  const aspect = variant.width / variant.height;

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
          onCropComplete={handleCropComplete}
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
              <Link href={`/create/${game.id}/select`} aria-label="Go back">
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
          <ZoomControl zoom={zoom} onZoomChange={setZoom} />
          <RotationControl rotation={rotation} onRotationChange={setRotation} />
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

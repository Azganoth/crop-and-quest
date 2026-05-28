import { Button } from "@/components/ui/button";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default async function CropVariantPage({
  params,
}: {
  params: Promise<{ gameId: string; variant: string }>;
}) {
  const { gameId, variant } = await params;

  return (
    <div className="relative flex flex-1 flex-col">
      {/* Top Header */}
      <div className="z-10 flex items-center justify-between border-b border-border/50 bg-card/80 p-4 backdrop-blur">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary capitalize">
            {variant.replace("-", " ")}
          </h1>
          <p className="text-sm text-muted-foreground">
            Adjust the image to fit the variant constraints.
          </p>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black/95">
        {/* react-easy-crop will go here */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display text-2xl tracking-widest text-muted-foreground/40 uppercase">
            Canvas
          </p>
        </div>
      </div>

      {/* Bottom Controls & Action Bar */}
      <div className="z-10 flex flex-col items-center justify-between gap-6 border-t border-border/50 bg-card/80 p-4 backdrop-blur md:flex-row md:gap-8">
        {/* Navigation - Left */}
        <div className="hidden sm:block">
          <Button variant="ghost" asChild>
            <Link href={`/create/${gameId}/select`}>Back</Link>
          </Button>
        </div>

        {/* Editor Controls - Center */}
        <div className="flex w-full max-w-xl flex-1 flex-col gap-4 sm:flex-row sm:gap-8">
          <div className="flex flex-1 items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <ZoomOut className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/3 bg-primary" />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <ZoomIn className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-1 items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <RotateCcw className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate Left</TooltipContent>
            </Tooltip>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/2 bg-primary" />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <RotateCw className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate Right</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Actions - Right */}
        <div className="flex w-full items-center justify-end gap-3 sm:w-auto sm:shrink-0">
          <Button variant="ghost" className="sm:hidden" asChild>
            <Link href={`/create/${gameId}/select`}>Back</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href={`/create/${gameId}/review`}>Skip Variant</Link>
          </Button>
          <Button asChild>
            <Link href={`/create/${gameId}/review`}>Save & Next</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

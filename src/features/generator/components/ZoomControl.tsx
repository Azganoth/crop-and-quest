import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Slider } from "@/components/ui/Slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function ZoomControl({ zoom, onZoomChange }: ZoomControlProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <Label>Zoom</Label>
        <span className="text-sm font-medium text-muted-foreground">{Math.round(zoom * 100)}%</span>
      </div>
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => onZoomChange(Math.max(1, zoom - 0.1))}
            >
              <ZoomOut className="size-5" />
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
          onValueChange={([val]) => onZoomChange(val)}
          className="flex-1"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
            >
              <ZoomIn className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In (+10%)</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/Button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/InputGroup";
import { Label } from "@/components/ui/Label";
import { Slider } from "@/components/ui/Slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { ZoomIn, ZoomOut } from "lucide-react";

export const MAX_ZOOM = 10;

interface ZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onZoom1to1?: () => void;
}

export function ZoomControl({ zoom, onZoomChange, onZoom1to1 }: ZoomControlProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <Label>Zoom</Label>
        <div className="flex items-center gap-1">
          {onZoom1to1 && (
            <Button variant="ghost" onClick={onZoom1to1}>
              1:1
            </Button>
          )}
          <Button variant="ghost" onClick={() => onZoomChange(1)}>
            Reset
          </Button>
          <InputGroup>
            <InputGroupInput
              type="number"
              value={Math.round(zoom * 100)}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (!isNaN(val)) {
                  onZoomChange(Math.max(1, val / 100));
                }
              }}
              className="max-w-20"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
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
          max={MAX_ZOOM}
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
              onClick={() => onZoomChange(Math.min(10, zoom + 0.1))}
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

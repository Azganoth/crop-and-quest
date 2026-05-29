import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Slider } from "@/components/ui/Slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { RotateCcw, RotateCw } from "lucide-react";

interface RotationControlProps {
  rotation: number;
  onRotationChange: (rotation: number) => void;
}

export function RotationControl({ rotation, onRotationChange }: RotationControlProps) {
  return (
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
              onClick={() => onRotationChange(rotation - 5)}
            >
              <RotateCcw className="size-5" />
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
          onValueChange={([val]) => onRotationChange(val)}
          className="flex-1"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => onRotationChange(rotation + 5)}
            >
              <RotateCw className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rotate Right (+5°)</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

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
import { RotateCcw, RotateCw } from "lucide-react";

interface RotationControlProps {
  rotation: number;
  onRotationChange: (rotation: number) => void;
}

export function RotationControl({ rotation, onRotationChange }: RotationControlProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <Label>Rotation</Label>
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={() => onRotationChange(0)}>
            Reset
          </Button>
          <InputGroup>
            <InputGroupInput
              type="number"
              value={rotation}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (!isNaN(val)) onRotationChange(Math.max(-180, Math.min(180, val)));
              }}
              className="max-w-20"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>°</InputGroupText>
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

import { cn } from "@/lib/cn";
import { Slot } from "radix-ui";
import { ComponentProps } from "react";

export interface PanelProps extends ComponentProps<"div"> {
  asChild?: boolean;
}

export function Panel({ className, asChild = false, ...props }: PanelProps) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      className={cn(
        "flex flex-col gap-6 overflow-hidden border border-border/50 bg-card p-6 shadow-xl",
        className,
      )}
      {...props}
    />
  );
}

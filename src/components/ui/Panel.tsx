import { cn } from "@/lib/cn";
import { ComponentProps } from "react";

export function Panel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 overflow-hidden border border-border/50 bg-card p-6 shadow-xl",
        className,
      )}
      {...props}
    />
  );
}

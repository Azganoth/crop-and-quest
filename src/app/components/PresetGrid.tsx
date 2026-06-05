"use client";

import { Button } from "@/components/ui/Button";
import {
  ConfirmationDialog,
  ConfirmationDialogContent,
  ConfirmationDialogTrigger,
} from "@/components/ui/ConfirmationDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { Preset, PRESETS } from "@/data/presets";
import { useMounted } from "@/hooks/useMounted";
import { useCustomPresetsStore } from "@/store/useCustomPresetsStore";
import { Plus, Trash2, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function PresetCard({
  preset,
  isCustom,
  onDelete,
}: {
  preset: Preset;
  isCustom?: boolean;
  onDelete?: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <article className="group relative aspect-video w-full">
      {isCustom && (
        <div className="absolute top-2 right-2 z-30 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 shadow-md hover:bg-secondary/80"
            asChild
            onClick={(e) => e.stopPropagation()}
            aria-label={`Edit ${preset.name}`}
          >
            <Link href={`/custom/${preset.id}/edit`}>
              <Pencil className="size-4" />
            </Link>
          </Button>
          <ConfirmationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <ConfirmationDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 shadow-md hover:bg-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                aria-label={`Delete ${preset.name}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </ConfirmationDialogTrigger>
          <ConfirmationDialogContent
            title="Delete Custom Preset"
            onConfirm={() => {
              setIsDialogOpen(false);
              if (onDelete) {
                setTimeout(onDelete, 200);
              }
            }}
          >
            Are you sure you want to delete <strong>{preset.name}</strong>? This action cannot be
            undone.
          </ConfirmationDialogContent>
        </ConfirmationDialog>
        </div>
      )}
      <Link
        href={`/create/${preset.id}/select`}
        className="absolute top-0 left-0 z-10 flex w-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-500 hover:z-20 hover:border-primary/50 hover:shadow-xl"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {preset.cover ? (
            <Image
              src={preset.cover}
              alt={`${preset.name} cover`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              placeholder={typeof preset.cover === "string" ? "empty" : "blur"}
              className="object-cover brightness-40 transition-all duration-700 group-hover:scale-110 group-hover:brightness-20"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-card transition-all duration-700 group-hover:brightness-50" />
          )}
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <h3 className="font-display text-2xl font-bold tracking-wide text-white drop-shadow-lg transition-transform duration-500 group-hover:scale-105">
              {preset.name}
            </h3>
          </div>
        </div>

        <div className="grid grid-rows-[0fr] bg-card transition-all duration-500 group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="flex flex-col px-4 pb-8">
              <p className="mt-4 mb-3 text-center text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Variants
              </p>
              <div className="flex w-full items-end justify-center gap-3">
                {preset.variants.map((v) => (
                  <Tooltip key={v.key}>
                    <TooltipTrigger asChild>
                      <div
                        className="border border-border bg-secondary shadow-md"
                        style={{
                          aspectRatio: `${v.width} / ${v.height}`,
                          height: "48px",
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent sideOffset={12} side="bottom">
                      <span className="font-semibold capitalize">{v.label || v.key}</span>
                      <span className="ml-2 font-medium text-muted-foreground">
                        {v.width}x{v.height}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function PresetGrid() {
  const isMounted = useMounted();
  const customPresets = useCustomPresetsStore((s) => s.customPresets);

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRESETS.map((preset) => (
          <PresetCard key={preset.id} preset={preset} />
        ))}
      </div>

      <section>
        <h2 className="mb-6 font-display text-2xl font-bold">Custom Presets</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <article className="relative aspect-video w-full">
            <Link
              href="/custom/new"
              className="group absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-primary/40 bg-card/50 shadow-sm transition-all duration-500 hover:z-20 hover:border-primary hover:bg-card hover:shadow-xl"
            >
              <div className="flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                <Plus className="size-6" />
              </div>
              <h3 className="mt-2 font-display text-xl font-bold tracking-wide text-primary">
                Custom Preset
              </h3>
              <p className="mt-1 px-4 text-center text-sm text-muted-foreground">
                Define dimensions for any game or mod.
              </p>
            </Link>
          </article>

          {isMounted &&
            customPresets.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isCustom
                onDelete={() => {
                  useCustomPresetsStore.getState().removeCustomPreset(preset.id);
                }}
              />
            ))}
        </div>
      </section>
    </div>
  );
}

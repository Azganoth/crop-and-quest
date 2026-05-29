"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GAMES } from "@/data/games";
import { CropperWorkspace } from "@/features/generator/components/CropperWorkspace";

export default function CropVariantPage({
  params,
}: {
  params: Promise<{ gameId: string; variant: string }>;
}) {
  const { gameId, variant: variantKey } = use(params);
  const router = useRouter();

  const game = GAMES.find((g) => g.id === gameId);
  const variantIndex = game?.variants.findIndex((v) => v.key === variantKey) ?? -1;
  const variant = game?.variants[variantIndex];
  const nextVariant = game?.variants[variantIndex + 1];

  useEffect(() => {
    if (!game || !variant) {
      router.replace(`/`);
    }
  }, [game, variant, router]);

  if (!game || !variant) {
    return null;
  }

  return (
    <CropperWorkspace
      game={game}
      variant={variant}
      variantIndex={variantIndex}
      totalVariants={game.variants.length}
      nextVariant={nextVariant}
      variantKey={variantKey}
    />
  );
}

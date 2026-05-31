"use client";

import { GAMES } from "@/data/games";
import { CropperWorkspace } from "@/app/create/[gameId]/[variant]/components/CropperWorkspace";
import { usePortraitStore } from "@/store/usePortraitStore";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function CropVariantPage({
  params,
  searchParams,
}: {
  params: Promise<{ gameId: string; variant: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { gameId, variant: variantKey } = use(params);
  const unwrappedSearchParams = use(searchParams);
  const isSingleEdit = unwrappedSearchParams.singleEdit === "true";

  const router = useRouter();

  const game = GAMES.find((g) => g.id === gameId);
  const variantIndex = game?.variants.findIndex((v) => v.key === variantKey) ?? -1;
  const variant = game?.variants[variantIndex];
  const nextVariant = game?.variants[variantIndex + 1];

  const { imageUrl } = usePortraitStore();

  useEffect(() => {
    if (!game || !variant) {
      router.replace(`/`);
    } else if (!imageUrl) {
      router.replace(`/create/${game.id}/select`);
    }
  }, [game, variant, imageUrl, router]);

  if (!game || !variant || !imageUrl) {
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
      isSingleEdit={isSingleEdit}
      imageUrl={imageUrl}
    />
  );
}

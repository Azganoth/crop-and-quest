"use client";

import { CropperWorkspace } from "@/app/create/[presetId]/[variant]/components/CropperWorkspace";
import { usePresetResolver } from "@/hooks/usePresetResolver";
import { usePortraitStore } from "@/store/usePortraitStore";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function CropVariantPage({
  params,
  searchParams,
}: {
  params: Promise<{ presetId: string; variant: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { presetId, variant: variantKey } = use(params);
  const unwrappedSearchParams = use(searchParams);
  const isSingleEdit = unwrappedSearchParams.singleEdit === "true";
  const { preset, isLoading } = usePresetResolver(presetId);
  const router = useRouter();

  const variantIndex = preset?.variants.findIndex((v) => v.key === variantKey) ?? -1;
  const variant = variantIndex >= 0 ? preset!.variants[variantIndex] : undefined;
  const nextVariant = preset?.variants[variantIndex + 1];

  const { imageUrl } = usePortraitStore();

  useEffect(() => {
    if (!isLoading && !preset) {
      router.replace("/");
    } else if (preset && !variant) {
      router.replace(`/create/${preset.id}/select`);
    } else if (!imageUrl) {
      router.replace(`/create/${presetId}/select`);
    }
  }, [preset, isLoading, variant, imageUrl, router, presetId]);

  if (isLoading || !preset || !variant || !imageUrl) {
    return null;
  }

  return (
    <CropperWorkspace
      preset={preset}
      variant={variant}
      variantIndex={variantIndex}
      totalVariants={preset.variants.length}
      nextVariant={nextVariant}
      variantKey={variantKey}
      isSingleEdit={isSingleEdit}
      imageUrl={imageUrl}
    />
  );
}

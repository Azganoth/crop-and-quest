"use client";

import { ReviewWorkspace } from "@/app/create/[presetId]/review/components/ReviewWorkspace";
import { usePresetResolver } from "@/hooks/usePresetResolver";
import { ROUTES } from "@/lib/routes";
import { usePortraitStore } from "@/store/usePortraitStore";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function ReviewPage({ params }: { params: Promise<{ presetId: string }> }) {
  const { presetId } = use(params);
  const { preset, isLoading } = usePresetResolver(presetId);
  const router = useRouter();
  const { imageUrl } = usePortraitStore();

  useEffect(() => {
    if (!isLoading && !preset) {
      router.replace(ROUTES.home);
    } else if (preset && !imageUrl) {
      router.replace(ROUTES.create.select(presetId));
    }
  }, [preset, isLoading, imageUrl, router, presetId]);

  if (isLoading || !preset || !imageUrl) return null;

  return <ReviewWorkspace preset={preset} />;
}

"use client";

import { SelectWorkspace } from "@/app/create/[presetId]/select/components/SelectWorkspace";
import { usePresetResolver } from "@/hooks/usePresetResolver";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function SelectPage({ params }: { params: Promise<{ presetId: string }> }) {
  const { presetId } = use(params);
  const { preset, isLoading } = usePresetResolver(presetId);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !preset) {
      router.replace("/");
    }
  }, [preset, isLoading, router]);

  if (isLoading || !preset) return null;

  return <SelectWorkspace preset={preset} />;
}

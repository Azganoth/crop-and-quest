"use client";

import { CustomPresetForm } from "@/app/custom/components/CustomPresetForm";
import { useCustomPresetsStore } from "@/store/useCustomPresetsStore";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function EditCustomPresetPage({
  params,
}: {
  params: Promise<{ presetId: string }>;
}) {
  const { presetId } = use(params);
  const router = useRouter();
  const customPresets = useCustomPresetsStore((s) => s.customPresets);

  const preset = customPresets.find((p) => p.id === presetId);

  useEffect(() => {
    if (!preset) {
      router.replace("/");
    }
  }, [preset, router]);

  if (!preset) return null;

  return <CustomPresetForm mode="edit" initialData={preset} />;
}

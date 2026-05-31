"use client";

import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import { usePortraitStore } from "@/store/usePortraitStore";

export function SessionProtector() {
  const imageFile = usePortraitStore((s) => s.imageFile);
  useBeforeUnload(!!imageFile);
  return null;
}

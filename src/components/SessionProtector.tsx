"use client";

import { useBeforeUnload } from "@/hooks/useBeforeUnload";

export function SessionProtector() {
  useBeforeUnload();
  return null;
}

"use client";

import { useEffect } from "react";
import { usePortraitStore } from "@/store/usePortraitStore";

export function useBeforeUnload() {
  const imageFile = usePortraitStore((s) => s.imageFile);

  useEffect(() => {
    if (!imageFile) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Most modern browsers ignore the return value and show a generic warning,
      // but some older browsers still require a return value.
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [imageFile]);
}

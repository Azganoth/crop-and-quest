import { GamePreset } from "@/data/games";
import { CropState } from "@/features/generator/store/usePortraitStore";
import JSZip from "jszip";

export async function generateGameZip(
  game: GamePreset,
  crops: Record<string, CropState | undefined>,
): Promise<Blob> {
  const zip = new JSZip();

  const fetchPromises = game.variants.map(async (variant) => {
    const crop = crops[variant.key];
    if (!crop || !crop.croppedBlobUrl) {
      if (!variant.optional) {
        throw new Error(`Missing required variant: ${variant.label}`);
      }
      return null;
    }

    const response = await fetch(crop.croppedBlobUrl);
    if (!response.ok) throw new Error(`Failed to fetch blob for ${variant.key}`);
    const blob = await response.blob();
    return { variant, blob };
  });

  const results = await Promise.allSettled(fetchPromises);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error(result.reason);
      // We throw on the first rejection to ensure the generated ZIP is not silently corrupted.
      throw new Error(
        `Failed to process variant: ${result.reason instanceof Error ? result.reason.message : "Unknown error"}`,
      );
    }

    if (result.value) {
      const { variant, blob } = result.value;
      const safeFilename = variant.filename.replace(/[^a-zA-Z0-9.\-_]/g, "");
      zip.file(safeFilename, blob);
    }
  }

  try {
    return await zip.generateAsync({ type: "blob" });
  } catch (e) {
    console.error("ZIP Generation failed:", e);
    throw new Error(
      "OOM: Failed to generate ZIP. The files might be too large for browser memory. Please use the individual download buttons below.",
    );
  }
}

export function triggerDownload(blobOrUrl: Blob | string, filename: string) {
  const isBlob = typeof blobOrUrl !== "string";
  const url = isBlob ? URL.createObjectURL(blobOrUrl as Blob) : (blobOrUrl as string);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (isBlob) {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

"use client";

import { Panel } from "@/components/ui/Panel";
import { Preset } from "@/data/presets";
import { usePortraitStore } from "@/store/usePortraitStore";
import { Image as ImageIcon, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface SelectWorkspaceProps {
  preset: Preset;
}

export function SelectWorkspace({ preset }: SelectWorkspaceProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { setPresetId, setImage } = usePortraitStore();

  const handleFile = (file: File | undefined | null) => {
    setError(null);
    if (!file) return;

    if (file.size === 0) {
      setError("The selected file is empty (0 bytes).");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/webp"];

    if (
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
    ) {
      setError(
        "HEIC/HEIF format from iPhones is not supported in browser. Please convert to JPEG or PNG first.",
      );
      return;
    }

    if (!validTypes.includes(file.type)) {
      setError("Unsupported file format. Please select a PNG, JPEG, or WebP image.");
      return;
    }

    setPresetId(preset.id);
    setImage(file);

    if (preset.variants.length > 0) {
      const firstVariant = preset.variants[0].key;
      router.push(`/create/${preset.id}/${firstVariant}`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    const uri = e.dataTransfer.getData("text/uri-list");
    if (uri && e.dataTransfer.files.length === 0) {
      setError(
        "Cross-origin image links are not supported to prevent security errors. Please save the image to your device and load the local file.",
      );
      return;
    }

    const file = e.dataTransfer.files?.[0];
    if (!file && !uri) {
      setError("Please drop a valid image file.");
      return;
    }

    handleFile(file);
  };

  return (
    <section
      aria-label="Upload Artwork"
      className="flex flex-1 flex-col items-center justify-center p-4"
    >
      <Panel className="w-full max-w-xl items-center p-10 text-center">
        <header>
          <h1 className="font-display text-2xl font-bold text-primary">
            Prepare a portrait for{" "}
            <span className="capitalize underline decoration-primary/70 underline-offset-4">
              {preset.name}
            </span>
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Select the base artwork for your character. It will be used to generate all the required
            portrait variants.
          </p>
        </header>
        <label
          htmlFor="file-upload"
          className="group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 py-16 transition-all hover:border-primary/50 hover:bg-muted/40"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="mb-4 transition-transform group-hover:scale-110">
            <ImagePlus className="size-8 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <h3 className="mb-1 font-semibold">Click to browse</h3>
          <p className="text-muted-foreground">or drag and drop an image here</p>
          <div className="mt-6 flex items-center gap-2 text-muted-foreground">
            <ImageIcon className="size-4" />
            <span>Supports PNG, JPEG, WEBP (Max 10MB)</span>
          </div>
        </label>

        {error && (
          <div className="mt-6 w-full border border-destructive/30 bg-destructive/15 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
      </Panel>
    </section>
  );
}

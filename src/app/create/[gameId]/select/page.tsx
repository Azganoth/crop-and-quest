"use client";

import { GAMES } from "@/data/games";
import { usePortraitStore } from "@/features/generator/store/usePortraitStore";
import { Image as ImageIcon, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function SelectImagePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { setImage, setGameId } = usePortraitStore();
  const game = GAMES.find((g) => g.id === gameId);

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
      setError("Unsupported file format. Please upload a PNG, JPEG, or WebP image.");
      return;
    }

    setGameId(gameId);
    setImage(file);

    if (game && game.variants.length > 0) {
      const firstVariant = game.variants[0].key;
      router.push(`/create/${gameId}/${firstVariant}`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const uri = e.dataTransfer.getData("text/uri-list");
    if (uri && e.dataTransfer.files.length === 0) {
      setError(
        "Cross-origin image links are not supported to prevent security errors. Please save the image to your device and upload the local file.",
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
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-xl flex-col items-center border border-border/50 bg-card p-6 text-center shadow-xl md:p-10">
        <h1 className="mb-4 font-display text-3xl font-bold text-primary capitalize">
          Prepare Portrait for {game?.name || gameId.replace("-", " ")}
        </h1>
        <p className="mb-8 max-w-md text-sm text-muted-foreground">
          Select the base artwork for your character. It will be used to generate all the required
          portrait variants for this game.
        </p>

        <div
          className="group relative flex w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 bg-muted/20 py-16 transition-all hover:border-primary/50 hover:bg-muted/40"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="mb-4 transition-transform group-hover:scale-110">
            <UploadCloud className="size-8 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <h3 className="mb-1 font-semibold">Click to upload</h3>
          <p className="text-sm text-muted-foreground">or drag and drop an image here</p>
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <ImageIcon className="size-4" />
            <span>Supports PNG, JPEG, WEBP (Max 10MB)</span>
          </div>
        </div>

        {error && (
          <div className="mt-6 w-full border border-destructive/30 bg-destructive/15 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

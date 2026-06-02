import { SessionProtector } from "@/app/create/[presetId]/components/SessionProtector";
import { PRESETS } from "@/data/presets";
import Image from "next/image";
import { ReactNode } from "react";

export default async function EditorLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ presetId: string }>;
}) {
  const { presetId } = await params;
  const preset = PRESETS.find((g) => g.id === presetId);

  return (
    <div className="relative flex flex-1 flex-col">
      <SessionProtector />
      {preset?.cover && (
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
          <Image
            src={preset.cover}
            alt="Background cover"
            fill
            sizes="100vw"
            className="object-cover opacity-20 mix-blend-overlay blur-sm"
            placeholder="blur"
          />
          {/* Vignette/gradient overlay to ensure text legibility */}
          <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/80 to-background" />
        </div>
      )}
      <div className="relative z-0 flex w-full flex-1 flex-col">{children}</div>
    </div>
  );
}

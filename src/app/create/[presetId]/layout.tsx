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
      <div className="pointer-events-none fixed inset-0 -z-1 overflow-hidden">
        {preset?.cover ? (
          <Image
            src={preset.cover}
            alt="Background cover"
            fill
            sizes="100vw"
            className="object-cover opacity-20 mix-blend-overlay blur-sm"
            placeholder="blur"
          />
        ) : (
          <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <div className="absolute -top-1/5 -left-1/10 h-[50vh] w-[50vw] rounded-full bg-primary/40 blur-[100px]" />
            <div className="absolute top-1/5 -right-1/10 h-[60vh] w-[40vw] rounded-full bg-secondary/40 blur-[120px]" />
            <div className="absolute -bottom-1/5 left-1/5 h-[50vh] w-[60vw] rounded-full bg-primary/20 blur-[100px]" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/80 to-background" />
      </div>
      <div className="relative z-0 flex w-full flex-1 flex-col">{children}</div>
    </div>
  );
}

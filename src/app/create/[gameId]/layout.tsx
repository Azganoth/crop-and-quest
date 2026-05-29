import { SessionProtector } from "@/features/generator/components/SessionProtector";
import { GAMES } from "@/data/games";
import Image from "next/image";
import { ReactNode } from "react";

export default async function EditorLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const game = GAMES.find((g) => g.id === gameId);

  return (
    <div className="relative flex flex-1 flex-col">
      <SessionProtector />
      {game && (
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
          <Image
            src={game.cover}
            alt="Background cover"
            fill
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

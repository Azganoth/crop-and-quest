"use client";

import { GAMES } from "@/data/games";
import { SelectWorkspace } from "@/app/create/[gameId]/select/components/SelectWorkspace";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function SelectImagePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const router = useRouter();

  const game = GAMES.find((g) => g.id === gameId);

  useEffect(() => {
    if (!game) {
      router.replace("/");
    }
  }, [game, router]);

  if (!game) return null;

  return <SelectWorkspace game={game} />;
}

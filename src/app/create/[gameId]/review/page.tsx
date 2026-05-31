"use client";

import { GAMES } from "@/data/games";
import { ReviewWorkspace } from "@/app/create/[gameId]/review/components/ReviewWorkspace";
import { usePortraitStore } from "@/store/usePortraitStore";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function ReviewPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const router = useRouter();

  const game = GAMES.find((g) => g.id === gameId);
  const { imageUrl } = usePortraitStore();

  useEffect(() => {
    if (!game) {
      router.replace("/");
    } else if (!imageUrl) {
      router.replace(`/create/${game.id}/select`);
    }
  }, [game, imageUrl, router]);

  if (!game || !imageUrl) return null;

  return <ReviewWorkspace game={game} />;
}

import Link from "next/link";
import Image from "next/image";
import { GAMES } from "@/data/games";

export default function Home() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-24">
      <div className="mb-24 flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
          Crop & Quest
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          A local-first portrait preparation tool for RPGs and CRPGs. Prepare your character
          portraits with precision, completely in your browser.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">Select a Game</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((game) => (
            <Link
              key={game.id}
              href={`/create/${game.id}/select`}
              className="group relative flex flex-col items-center justify-start overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden border-b border-border/50 bg-muted">
                <Image
                  src={game.cover}
                  alt={`${game.name} cover`}
                  fill
                  placeholder="blur"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 items-center p-6">
                <h3 className="text-center font-semibold transition-colors group-hover:text-primary">
                  {game.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

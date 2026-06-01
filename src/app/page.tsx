import { BackgroundDecorations } from "@/components/layout/BackgroundDecorations";
import { Panel } from "@/components/ui/Panel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { GAMES } from "@/data/games";
import { Crop, Gamepad2, ImagePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const STEPS = [
  {
    icon: Gamepad2,
    title: "1. Choose a Preset",
    description: "Select your RPG to automatically load the exact portrait dimensions needed.",
  },
  {
    icon: ImagePlus,
    title: "2. Import Artwork",
    description: "Load your character art. Everything is processed locally in your browser.",
  },
  {
    icon: Crop,
    title: "3. Crop & Export",
    description: "Frame your portraits and instantly download a ready-to-extract ZIP pack.",
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden py-12 md:py-24">
      <BackgroundDecorations />

      <div className="relative z-10 container mx-auto max-w-7xl px-4">
        <header className="mb-24 flex flex-col items-center justify-center text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
            Crop & Quest
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A local-first portrait preparation tool for RPGs and CRPGs. Prepare your character
            portraits with precision, completely in your browser.
          </p>
        </header>

        <section aria-label="How it works" className="mb-24">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Panel
                key={i}
                asChild
                className="items-center bg-card/40 p-8 text-center backdrop-blur supports-backdrop-filter:bg-card/20"
              >
                <article>
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <step.icon className="size-8" />
                  </div>
                  <h3 className="mb-3 font-display text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </article>
              </Panel>
            ))}
          </div>
        </section>

        <section aria-labelledby="preset-selection-heading" className="mb-12">
          <h2
            id="preset-selection-heading"
            className="mb-8 text-center font-display text-3xl font-bold"
          >
            Select a Preset
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {GAMES.map((game) => (
              <article key={game.id} className="relative aspect-video w-full">
                <Link
                  href={`/create/${game.id}/select`}
                  className="group absolute top-0 left-0 z-10 flex w-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-500 hover:z-20 hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="relative aspect-video w-full">
                    <Image
                      src={game.cover}
                      alt={`${game.name} cover`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      placeholder="blur"
                      className="object-cover brightness-40 transition-all duration-700 group-hover:scale-110 group-hover:brightness-[0.20]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <h3 className="font-display text-2xl font-bold tracking-wide text-white drop-shadow-lg transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                        {game.name}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-rows-[0fr] bg-card transition-all duration-500 group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <div className="flex flex-col px-4 pb-4">
                        <p className="mt-4 mb-3 text-center text-xs font-medium tracking-wider text-muted-foreground uppercase">
                          Variants
                        </p>
                        <div className="flex w-full items-end justify-center gap-3">
                          <TooltipProvider delayDuration={100}>
                            {game.variants.map((v) => (
                              <Tooltip key={v.key}>
                                <TooltipTrigger asChild>
                                  <div
                                    className="rounded-sm border border-border bg-secondary shadow-md"
                                    style={{
                                      aspectRatio: `${v.width} / ${v.height}`,
                                      height: "48px",
                                    }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent sideOffset={12} side="bottom">
                                  <span className="font-semibold capitalize">{v.key}</span>
                                  <span className="ml-2 font-medium text-muted-foreground">
                                    {v.width}x{v.height}
                                  </span>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

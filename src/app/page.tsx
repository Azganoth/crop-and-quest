import { PresetGrid } from "@/app/components/PresetGrid";
import { BackgroundDecorations } from "@/components/layout/BackgroundDecorations";
import { Panel } from "@/components/ui/Panel";
import { Crop, Gamepad2, ImagePlus } from "lucide-react";

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

      <div className="relative z-10 container mx-auto max-w-7xl px-12">
        <header className="mb-24 flex flex-col items-center justify-center text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
            Crop & Quest
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A local-first portrait preparation tool for RPGs and CRPGs. Prepare your character
            portraits with precision, completely in your browser.
          </p>
        </header>

        <section
          aria-label="How it works"
          className="mx-auto mb-24 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3"
        >
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
        </section>

        <section aria-labelledby="preset-selection-heading" className="mb-12">
          <h2
            id="preset-selection-heading"
            className="mb-8 text-center font-display text-3xl font-bold"
          >
            Select a Preset
          </h2>
          <PresetGrid />
        </section>
      </div>
    </div>
  );
}

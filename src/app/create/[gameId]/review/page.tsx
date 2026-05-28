import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw, Archive } from "lucide-react";

export default async function ReviewPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="container mx-auto max-w-5xl flex-1 px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-display text-4xl font-extrabold text-primary">
            Review Portraits
          </h1>
          <p className="text-lg text-muted-foreground">
            Verify your generated variants before exporting the final portrait pack.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Rendered crops will be displayed here */}
          {[1, 2, 3].map((variant) => (
            <div
              key={variant}
              className="group border bg-card/50 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex aspect-square items-center justify-center bg-black/80">
                <span className="font-display tracking-widest text-muted-foreground/30 uppercase">
                  Preview
                </span>
              </div>
              <div className="border-t p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold capitalize">Variant {variant}</span>
                  <Button variant="ghost" size="icon-sm" title="Download single">
                    <Download className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 bg-card/50 p-6 shadow-sm sm:flex-row">
          <Button variant="ghost" asChild>
            <Link href={`/create/${gameId}/select`}>
              <RefreshCcw className="mr-2 size-4" />
              Start Over
            </Link>
          </Button>
          <Button size="lg" className="w-full px-8 shadow-lg sm:w-auto">
            <Archive className="mr-2 size-5" />
            Export All as ZIP
          </Button>
        </div>
      </div>
    </div>
  );
}

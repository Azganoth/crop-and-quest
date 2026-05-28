import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export default async function SelectImagePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-3xl flex-col items-center border bg-card p-8 text-center shadow-xl md:p-12">
        <h1 className="mb-4 font-display text-3xl font-bold text-primary capitalize">
          Prepare Portrait for {gameId.replace("-", " ")}
        </h1>
        <p className="mb-12 max-w-lg text-muted-foreground">
          Select the base artwork for your character. It will be used to generate all the required
          portrait variants for this game.
        </p>

        <div className="group relative w-full cursor-pointer">
          <div className="absolute inset-0 bg-primary/5 transition-colors group-hover:bg-primary/10" />
          <div className="relative w-full border-2 border-dashed border-primary/30 p-16 text-center transition-all group-hover:border-primary/60">
            <UploadCloud className="mx-auto mb-4 size-12 text-primary/50 transition-colors group-hover:text-primary" />
            <p className="text-lg font-medium text-foreground">Drag and drop your artwork here</p>
            <p className="mt-2 text-sm text-muted-foreground">
              or click to browse from your device
            </p>
            {/* File input and validation logic will go here */}
          </div>
        </div>

        <div className="mt-12 flex w-full justify-between gap-4 border-t border-border/50 pt-8">
          <Button variant="ghost" asChild>
            <Link href={`/games/${gameId}`}>Cancel</Link>
          </Button>
          <Button asChild>
            <Link href={`/create/${gameId}/default-variant`}>Next Step</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

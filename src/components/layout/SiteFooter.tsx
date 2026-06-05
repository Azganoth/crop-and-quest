"use client";

import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/create") || pathname.startsWith("/custom")) {
    return null;
  }

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          Crop & Quest is a fan-made tool and is not affiliated with any game developers or
          publishers.
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="https://ko-fi.com/azganoth"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline underline-offset-4 transition-colors hover:text-foreground/80"
          >
            Support on Ko-Fi
          </a>
        </div>
      </div>
    </footer>
  );
}

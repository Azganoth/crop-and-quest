"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { Crop } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center space-x-2 text-primary transition-colors hover:text-primary/80"
          title="Crop & Quest Home"
        >
          <Crop className="h-8 w-8" />
          <span className={isHome ? "sr-only" : "hidden text-xl font-bold sm:inline-block"}>
            Crop & Quest
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 px-8 text-[#13C3FF] hover:bg-[#13C3FF]/10 hover:text-[#13C3FF] dark:text-[#FF5E5B] dark:hover:bg-[#FF5E5B]/10 dark:hover:text-[#FF5E5B]"
                asChild
              >
                <a href="https://ko-fi.com/azganoth" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="size-6">
                    <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z" />
                  </svg>
                  <span className="sr-only">Support on Ko-fi</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Support on Ko-fi</p>
            </TooltipContent>
          </Tooltip>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

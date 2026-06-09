"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { Crop } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link
          href={ROUTES.home}
          className="flex items-center space-x-2 text-primary transition-colors hover:text-primary/80"
          title="Crop & Quest Home"
        >
          <Crop className="h-8 w-8" />
          <span className={isHome ? "sr-only" : "hidden text-xl font-bold sm:inline-block"}>
            Crop & Quest
          </span>
        </Link>
        <nav aria-label="Utility Links" className="flex items-center space-x-2">
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/Azganoth/crop-and-quest"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitHub className="size-5" />
                  <span className="sr-only">GitHub Repository</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>GitHub Repository</p>
            </TooltipContent>
          </Tooltip>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function GitHub({ className }: { className?: string }) {
  return (
    <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>GitHub</title>
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        fill="currentColor"
      />
    </svg>
  );
}

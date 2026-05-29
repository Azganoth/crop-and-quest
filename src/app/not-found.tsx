import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="mb-4 text-6xl font-extrabold text-primary">404</h2>
      <h3 className="mb-4 text-2xl font-semibold">Page Not Found</h3>
      <p className="mb-8 text-muted-foreground">
        We couldn&apos;t find the page you were looking for.
      </p>
      <Button asChild size="lg">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}

import { Link } from "next-view-transitions";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h2 className="text-3xl font-bold text-destructive">404 Not Found</h2>
      <p className="mb-8 mt-3 text-muted-foreground">The page or product you are looking for does not exist</p>
      <Button variant={"secondary"} asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}

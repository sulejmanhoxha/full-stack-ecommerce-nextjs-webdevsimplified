import { Link } from 'next-view-transitions'

import { Button } from "@/components/ui/button";

export default function Expired() {
  return (
    <>
      <h1 className="mb-4 text-4xl">Download link expired</h1>
      <Button asChild size="lg">
        <Link href="/orders">Get New Link</Link>
      </Button>
    </>
  );
}

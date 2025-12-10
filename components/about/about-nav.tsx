import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function AboutNav() {
  return (
    <nav className="fixed w-full z-50 top-0 left-0 p-6">
      <Link href="/">
        <Button variant="ghost" className="rounded-full hover:bg-stone-200/50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>
    </nav>
  );
}

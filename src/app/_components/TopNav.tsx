import Link from "next/link";
import { AuthShowcase } from "./AuthShowcase";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between p-4 text-white">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-bold text-[hsl(280,100%,70%)]">
          WGG
        </Link>
        <Link href="/gallery" className="hover:text-white/80 transition">
          Gallery
        </Link>
      </div>
      <div>
        <AuthShowcase />
      </div>
    </nav>
  );
}
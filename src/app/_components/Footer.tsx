import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-background/50 py-6 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Wadebridge Gaming Group. All rights reserved.
        </p>
        <Link
          href="/privacy"
          className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
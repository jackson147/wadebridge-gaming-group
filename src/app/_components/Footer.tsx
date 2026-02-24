import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-background/50 py-6 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4">
        <div className="flex justify-center gap-4">
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
          >
            Contact Us
          </Link>
           <Link
            href="/safeguarding"
            className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
          >
            Safeguarding
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
          >
            Privacy Policy
          </Link>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Wadebridge Gaming Group. All rights reserved. v{process.env.NEXT_PUBLIC_PACKAGE_VERSION}
        </p>
      </div>
    </footer>
  );
}
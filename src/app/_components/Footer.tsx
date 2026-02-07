import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-background/50 py-6 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 md:grid md:grid-cols-3">
        <p className="order-2 text-center text-sm text-muted-foreground md:order-1 md:text-left">
          &copy; {new Date().getFullYear()} Wadebridge Gaming Group. All rights reserved.
        </p>
        <div className="order-1 flex justify-center gap-4 md:order-2">
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
        <div className="order-3 hidden md:block" />
      </div>
    </footer>
  );
}
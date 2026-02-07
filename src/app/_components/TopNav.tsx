"use client";

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Menu } from "lucide-react";
import { AuthShowcase } from "./AuthShowcase";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "~/components/ui/sheet";

export function TopNav() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/80 px-4 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between text-foreground">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-2xl font-bold text-primary transition-transform hover:scale-105"
          >
            WBG
          </Link>
          {/* Desktop Gallery Link */}
          <div className="hidden md:block">
            <Button asChild variant="link" className="text-lg font-bold text-foreground">
              <Link href="/">
                Home
              </Link>
            </Button>
            <Button asChild variant="link" className="text-lg font-bold text-foreground">
              <Link href="/gallery">
                Gallery
              </Link>
            </Button>
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {/* Dark Mode Toggle */}
          <ModeToggle />
          {/* Auth Showcase */}
          {/* <AuthShowcase /> */}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="mt-8 flex flex-col items-center gap-6">
                <SheetClose asChild>
                  <Button asChild variant="link" className="text-2xl text-foreground">
                    <Link href="/">Home</Link> 
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild variant="link" className="text-2xl text-foreground">
                    <Link href="/gallery">Gallery</Link> 
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild variant="link" className="text-2xl text-foreground">
                    <Link href="/safeguarding">Safeguarding</Link>
                  </Button>
                </SheetClose>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {/* <AuthShowcase /> */}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
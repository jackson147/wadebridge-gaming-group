"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { AuthShowcase } from "./AuthShowcase";

export function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      // Do not close if the click is inside a dialog
      if (target instanceof Element && target.closest('[role="dialog"]')) {
        return;
      }
      if (
        isMenuOpen &&
        navRef.current &&
        !navRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, navRef]);

  return (
    <nav ref={navRef} className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#15162c]/80 px-4 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between text-white">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-2xl font-bold text-[hsl(280,100%,70%)] transition-transform hover:scale-105"
            onClick={() => setIsMenuOpen(false)}
          >
            WBG
          </Link>
          {/* Desktop Gallery Link */}
          <div className="hidden md:block">
            <Link
              href="/gallery"
              className="text-lg font-bold transition hover:text-[hsl(280,100%,70%)]"
            >
              Gallery
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <AuthShowcase />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <FaTimes className="size-6" /> : <FaBars className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 w-full bg-[#15162c] p-4 md:hidden">
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/gallery"
              className="text-lg font-bold transition hover:text-[hsl(280,100%,70%)]"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <div
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <AuthShowcase />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
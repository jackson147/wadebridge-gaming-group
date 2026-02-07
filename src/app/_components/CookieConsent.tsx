"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check local storage to see if the user has already accepted/declined
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("cookie-consent", "acknowledged");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-lg md:p-6 animate-in slide-in-from-bottom-full duration-300">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center text-sm text-muted-foreground md:text-left">
          <p>
            We use essential cookies to maintain your login session and ensure site security.{" "}
            <Link href="/privacy" className="font-medium underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={dismiss}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}

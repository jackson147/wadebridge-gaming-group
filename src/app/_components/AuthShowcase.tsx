"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { SignInModal } from "./SignInModal";
import { SignOutConfirmationModal } from "./SignOutConfirmationModal";

export function AuthShowcase() {
  const { data: session } = useSession();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!session) {
    // return <SignInModal />;
    return <SignInModal />;
  }

  const handleSignOut = () => {
    setIsConfirmOpen(false);
    void signOut();
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button onClick={() => setIsConfirmOpen(true)} variant="secondary">
          Sign out
        </Button>
      </div>
      <SignOutConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSignOut}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out?"
      />
    </>
  );
}

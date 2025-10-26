"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { SignInModal } from "./SignInModal";
import { SignOutConfirmationModal } from "./SignOutConfirmationModal";
import { SignInModalV2 } from "./SignInModalV2";

export function AuthShowcase() {
  const { data: session } = useSession();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!session) {
    // return <SignInModal />;
    return <SignInModalV2 />;
  }

  const handleSignOut = () => {
    setIsConfirmOpen(false);
    void signOut();
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="rounded-full bg-white/10 px-6 py-2 font-semibold no-underline transition hover:bg-white/20"
        >
          Sign out
        </button>
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

"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { Button } from "~/components/ui/button";
import { SignOutConfirmationModal } from "../_components/SignOutConfirmationModal";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background text-foreground">
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Login</h1>
        <Button
          size="lg"
          className="gap-2 text-lg"
          onClick={() => void signIn("discord", { callbackUrl: "/admin" })}
        >
          <FaDiscord className="size-6" />
          Sign in with Discord
        </Button>
      </div>
    );
  }

  const handleSignOut = () => {
    setIsConfirmOpen(false);
    void signOut({ callbackUrl: "/" });
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Logged in as <span className="font-medium text-foreground">{session.user?.name}</span>
          </div>
          <Button onClick={() => setIsConfirmOpen(true)} variant="destructive">
            Sign out
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="text-xl font-semibold">Welcome Back</h2>
          <p className="mt-2 text-muted-foreground">
            You have access to the admin controls.
          </p>
        </div>
      </div>

      <SignOutConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSignOut}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out of the admin area?"
      />
    </div>
  );
}
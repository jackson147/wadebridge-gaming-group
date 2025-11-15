"use client";

import { FaDiscord } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export function SignInModal() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary">
          Sign in
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Sign In</DialogTitle>
        <div className="mt-4 grid gap-4">
          <Button
            className="w-full"
            onClick={() => signIn("discord", { redirectTo: "/" })}>
            <FaDiscord className="size-5" />
            <span>Sign in with Discord</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

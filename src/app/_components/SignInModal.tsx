"use client";

import { Fragment, useState } from "react";
import { Transition, TransitionChild } from "@headlessui/react";
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
        <Button>Sign in</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Sign In</DialogTitle>
        <div className="mt-4 grid gap-4">
          <button
            onClick={() => signIn("discord", { redirectTo: "/" })}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-[#5865F2] px-4 py-3 font-semibold text-white transition hover:bg-[#4752C4]"
          >
            <FaDiscord className="size-5" />
            <span>Sign in with Discord</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { FaDiscord } from "react-icons/fa";
import { signIn } from "next-auth/react";

export function SignInModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-white/10 px-6 py-2 font-semibold no-underline transition hover:bg-white/20"
      >
        Sign in
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#15162c] border-2 border-white/10 p-6 text-left align-middle text-white shadow-xl transition-all">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6">
                    Sign In
                  </DialogTitle>
                  <div className="mt-4 grid gap-4">
                    <button
                      onClick={() => signIn("discord", { redirectTo: "/" })}
                      className="flex w-full items-center justify-center gap-3 rounded-md bg-[#5865F2] px-4 py-3 font-semibold text-white transition hover:bg-[#4752C4]"
                    >
                      <FaDiscord className="size-5" />
                      <span>Sign in with Discord</span>
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
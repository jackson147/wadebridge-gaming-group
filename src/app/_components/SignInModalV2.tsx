"use client";

import { Fragment, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { GalleryVerticalEnd } from "lucide-react";
import {
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldDescription,
  Field,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import Image from "next/image";

export function SignInModalV2() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign in</Button>
      </DialogTrigger>
      <DialogContent>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex items-center justify-center rounded-md">
                <Image
                  src="/logo_no_background.png"
                  className="w-42 h-42 sm:w-48 sm:h-48 lg:w-72 lg:h-72 rounded-full object-cover aspect-square"
                  alt={""}
                  height={416}
                  width={512}
                />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">
              Welcome to Wadebridge Gaming Group
            </h1>
            <FieldDescription>
              Select one of the login providers below.
            </FieldDescription>
          </div>
          <Field className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => signIn("discord", { redirectTo: "/" })}
            >
              <FaDiscord />
              Continue with Discord
            </Button>
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}

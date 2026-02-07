"use client";

import { useActionState } from "react";
import { submitContactUs } from "../common/email/actions";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

const initialState = {
  message: "",
  errors: {},
  fields: {
    name: "",
    email: "",
    message: "",
  },
  success: false,
};

export default function ContactPage() {
  const [state, formAction] = useActionState(submitContactUs, initialState);

  return (
    <main className="flex grow flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Contact Us</CardTitle>
          <CardDescription className="text-base">
            Please fill out the form below to get in touch with us.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.success ? (
            <div className="rounded-md bg-green-50 p-4 text-green-700">
              <p className="text-lg font-medium">Thank you</p>
              <p>{state.message}</p>
            </div>
          ) : (
            <>
              <div className="mb-6 space-y-2 text-muted-foreground">
                <p>
                  Whether you have a question about the club, want to join a game, or just want to say hello, we&apos;d love to hear from you.
                </p>
                <p>
                  Simply fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
              </div>
              <form action={formAction} className="grid gap-4">
              {state.message && !state.success && (
                <div className="text-red-500 font-medium">{state.message}</div>
              )}
              <div className="grid gap-2">
                <label htmlFor="name" className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                <Input id="name" name="name" placeholder="Your Name" className="text-lg h-12" defaultValue={state.fields?.name} />
                {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name[0]}</p>}
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                <Input id="email" name="email" type="email" placeholder="Your Email" className="text-lg h-12" defaultValue={state.fields?.email} />
                {state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email[0]}</p>}
              </div>
              <div className="grid gap-2">
                <label htmlFor="message" className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  className="text-lg min-h-[80px]"
                  placeholder="Your Message"
                  defaultValue={state.fields?.message}
                />
                {state.errors?.message && <p className="text-red-500 text-sm">{state.errors.message[0]}</p>}
              </div>
              <Button type="submit" size="lg" className="text-lg">Submit</Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

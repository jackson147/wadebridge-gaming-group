"use client";

import { useActionState } from "react";
import { submitSafeguardingConcern } from "./actions";
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

export default function SafeguardingPage() {
  const [state, formAction] = useActionState(submitSafeguardingConcern, initialState);

  return (
    <main className="flex grow flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Safeguarding</CardTitle>
          <CardDescription className="text-base">
            Please fill out the form below to submit a safeguarding concern.
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
                  We want our club to be a fun and safe place for everyone. Even as a small group, it&apos;s important that we look out for one another.
                </p>
                <p>
                  If you have any concerns about a member&apos;s welfare or behavior, please let us know here. All reports are treated as confidential.
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

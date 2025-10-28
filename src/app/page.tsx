import { FaFacebook, FaDiscord } from "react-icons/fa";
import { HydrateClient } from "~/trpc/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Image from "next/image";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex grow flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/logo_no_background_white.png"
              alt="Wadebridge Gaming Group Logo"
              width={288}
              height={288}
              className="rounded-full"
              priority
            />
            <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Wadebridge <span className="text-primary">Gaming</span> Group
            </h1>
          </div>

          <p className="max-w-3xl text-center text-3xl font-semibold">
            Board games and other tabletop fun every{" "}
            <span className="text-orange-400">Thursday at 6:30 PM</span> at the
            Egloshayle Pavilion, Wadebridge.
          </p>

          <Card className="w-full max-w-4xl border-white/20 bg-white/5">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Find us at
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/20 shadow-lg">
                <iframe
                  title="Meeting place - Egloshayle Pavilion, Wadebridge"
                  src="https://www.google.com/maps?q=Wadebridge+Egloshayle+Pavilion,+Wadebridge,+PL27+6AQ&output=embed"
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="text-center text-lg">
                <p className="font-semibold">Egloshayle Pavilion</p>
                <p>Wadebridge, PL27 6AQ</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex w-full max-w-2xl flex-col items-center gap-4">
            <h2 className="text-center text-2xl font-semibold">
              Join our online community
            </h2>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <Button asChild size="lg" className="h-auto py-4 text-xl">
                <a href="https://discord.gg/ByhbFs6HXm" target="_blank">
                  <FaDiscord className="mr-2 size-6" />
                  Discord
                </a>
              </Button>
              <Button asChild size="lg" className="h-auto py-4 text-xl">
                <a href="https://www.facebook.com/groups/488964738552511" target="_blank">
                  <FaFacebook className="mr-2 size-6" />
                  Facebook
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
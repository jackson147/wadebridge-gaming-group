import Link from "next/link";
import { FaFacebook, FaDiscord } from "react-icons/fa";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
    const hello = await api.post.hello({ text: "from tRPC" });
    const session = await auth();

    if (session?.user) {
        void api.post.getLatest.prefetch();
    }

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
                        Wadebridge <span className="text-[hsl(280,100%,70%)]">Gaming</span> Group
                    </h1>
                   <p className="mt-4 text-2xl font-semibold text-white/80 text-center">
    Join us for board games and other tabletop fun every
    <span className="text-orange-400"> Thursday at 6.30pm</span>.
    <br />
    Click below to find out more and chat to us.
</p>

                    {/* Social Links as cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                        <a
                            className="flex flex-col items-center gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20 transition"
                            href="https://discord.gg/cFWZA79S"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Discord"
                        >
                            <FaDiscord size={48} className="text-indigo-400" />
                            <span className="font-bold text-2xl">Discord</span>
                        </a>
						<a
                            className="flex flex-col items-center gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20 transition"
                            href="https://www.facebook.com/groups/488964738552511"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <FaFacebook size={48} className="text-blue-500" />
                            <span className="font-bold text-2xl">Facebook</span>
                        </a>
                    </div>

                    {/* Google Maps Box and Address at the bottom */}
                    <div className="w-full flex flex-col items-center gap-4 mt-12">
                        <div className="w-full max-w-xl h-128 rounded-xl overflow-hidden shadow-lg border border-white/20">
                            <iframe
                                title="Meeting place - Egloshayle Pavilion, Wadebridge"
                                src="https://www.google.com/maps?q=Wadebridge+Egloshayle+Pavilion,+Wadebridge,+PL27+6AQ&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        <div className="text-lg text-white/80 text-center">
                            <p className="font-semibold">Address:</p>
                            <p>Egloshayle Pavilion, Wadebridge, PL27 6AQ</p>
                        </div>
                    </div>
                </div>
            </main>
        </HydrateClient>
    );
}
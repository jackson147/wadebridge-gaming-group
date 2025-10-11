import { FaFacebook, FaDiscord } from "react-icons/fa";
import { FaImages } from "react-icons/fa6";
import { AuthShowcase } from "~/app/_components/AuthShowcase";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <img
                        src="/logo_no_background_white.png"
                        alt="Wadebridge Gaming Group Logo"
                        className="w-42 h-42 sm:w-48 sm:h-48 lg:w-72 lg:h-72 rounded-full object-cover"
                        style={{ aspectRatio: "1 / 1" }}
                    />
                    <h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem] text-center">
                        Wadebridge <span className="text-[hsl(280,100%,70%)]">Gaming</span> Group
                    </h1>
                    <div className="mt-4">
                        <AuthShowcase />
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-white/80 text-center">
                        Join us for board games and other tabletop fun every
                        <span className="text-orange-400"> Thursday at 6.30pm</span> at the Egloshayle Pavilion, Wadebridge.
                    </p>

                    <div className="w-full flex flex-col items-center gap-4">
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

                    <p className="mt-4 text-2xl font-semibold text-white/80 text-center">
                        Click below to to join our Discord community and Facebook group
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                        <a
                            className="flex flex-col items-center gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20 transition"
                            href="https://discord.gg/ByhbFs6HXm"
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
                </div>
            </main>
        </HydrateClient>
    );
}
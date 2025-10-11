import "~/styles/globals.css";

import type { Metadata } from "next";
import Link from "next/link"; // <-- Added Link for navigation
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
	title: "Wadebridge Gaming Group",
	description: "Website for the Wadebridge Gaming Group",
	icons: [
		{ rel: "icon", type: "image/svg+xml", url: "/favicon.svg" },
		{ rel: "icon", url: "/favicon.ico" }
	],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`}>
			<body>
				<TRPCReactProvider>
					{/* Simple Fixed Navigation Bar */}
					<nav className="sticky top-0 z-50 bg-[#2e026d] p-4 shadow-lg flex justify-center">
						<div className="flex space-x-6 text-xl font-semibold">
							<Link href="/" className="text-white hover:text-[hsl(280,100%,70%)] transition duration-150">
								Home
							</Link>
							<Link href="/gallery" className="text-white hover:text-[hsl(280,100%,70%)] transition duration-150">
								Gallery
							</Link>
						</div>
					</nav>
					
					{/* Content */}
					{children}
					
				</TRPCReactProvider>
			</body>
		</html>
	);
}

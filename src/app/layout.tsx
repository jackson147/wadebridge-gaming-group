import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";
import { auth } from "~/server/auth";
import { TopNav } from "./_components/TopNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Wadebridge Gaming Group",
  description: "Community website for the Wadebridge Gaming Group",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white`}>
        <SessionProvider session={session}>
          <TRPCReactProvider>
            <TopNav />
            {children}
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}